import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Analysis, Writing, UserTokenUsage } from 'src/entities';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { OpenAiProvider } from '../ai/providers/openai.provider';
import { PromptTemplatesService } from '../ai/services/prompt-templates.service';
import { ResponseParserService } from './services/response-parser.service';
import { TokenTrackerService } from './services/token-tracker.service';
import { TokenResetScheduler } from './services/token-reset.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analysis, Writing, UserTokenUsage]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    OpenAiProvider,
    PromptTemplatesService,
    ResponseParserService,
    TokenTrackerService,
    TokenResetScheduler,
  ],
  exports: [AnalysisService, TokenTrackerService],
})
export class AnalysisModule {}
