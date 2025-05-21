import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyPageViews } from '../../common/database/entities/daily-page-views/daily-page-views.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsGateway } from './analytics.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyPageViews]),
    ScheduleModule.forRoot(),
  ],
  providers: [AnalyticsService, AnalyticsGateway],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {} 