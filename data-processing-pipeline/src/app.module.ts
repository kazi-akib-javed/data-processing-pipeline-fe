import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './common/env-config/env-config.module';
import { RedisConfigModule } from './common/redis/redis.module';
import { TypeormConfigModule } from './common/database/database.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    EnvConfigModule,
    RedisConfigModule,
    TypeormConfigModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
