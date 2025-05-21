import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { DailyPageViews } from '../../common/database/entities/daily-page-views/daily-page-views.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('REDIS_ANALYTICS')
    private readonly redis: Redis,
    @InjectRepository(DailyPageViews)
    private readonly dailyPageViewsRepository: Repository<DailyPageViews>,
  ) {}

  // Get a new Redis subscriber instance
  getRedisSubscriber(): Redis {
    return new Redis(this.redis.options);
  }

  // Increment page view count in Redis
  async incrementPageView(page: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const key = `page_views:${page}:${today}`;
    await this.redis.incr(key);
  }

  // Get current page view count from Redis
  async getCurrentPageViews(page: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const key = `page_views:${page}:${today}`;
    const count = await this.redis.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  // Get all page views for today from Redis
  async getAllCurrentPageViews(): Promise<Record<string, number>> {
    const today = new Date().toISOString().split('T')[0];
    const keys = await this.redis.keys(`page_views:*:${today}`);
    const views: Record<string, number> = {};

    for (const key of keys) {
      const page = key.split(':')[1];
      const count = await this.redis.get(key);
      views[page] = count ? parseInt(count, 10) : 0;
    }

    return views;
  }

  // Store daily page views in database (runs at midnight)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async storeDailyPageViews(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    const keys = await this.redis.keys(`page_views:*:${dateStr}`);
    
    for (const key of keys) {
      const page = key.split(':')[1];
      const count = await this.redis.get(key);
      
      if (count) {
        const dailyPageView = new DailyPageViews();
        dailyPageView.page = page;
        dailyPageView.count = parseInt(count, 10);
        dailyPageView.view_date = new Date(dateStr);
        
        await this.dailyPageViewsRepository.save(dailyPageView);
        
        // Delete the key after storing in database
        await this.redis.del(key);
      }
    }
  }
} 