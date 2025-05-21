import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('page-view/:page')
  async trackPageView(@Param('page') page: string): Promise<void> {
    await this.analyticsService.incrementPageView(page);
  }

  @Get('page-views/:page')
  async getPageViews(@Param('page') page: string): Promise<number> {
    return this.analyticsService.getCurrentPageViews(page);
  }

  @Get('page-views')
  async getAllPageViews(): Promise<Record<string, number>> {
    return this.analyticsService.getAllCurrentPageViews();
  }
} 