import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfiguration } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WritingsModule } from './modules/writings/writings.module';
import { DailyTipsModule } from './modules/daily-tips/daily-tips.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { WritingSuggestionsModule } from './modules/writing-suggestions/writing-suggestions.module';
import { FeedbackCategoriesModule } from './modules/feedback-categories/feedback-categories.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfiguration,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    WritingsModule,
    AnalyticsModule,
    UsersModule,
    DailyTipsModule,
    AchievementsModule,
    FeedbackCategoriesModule,
    WritingSuggestionsModule,
    GamificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
