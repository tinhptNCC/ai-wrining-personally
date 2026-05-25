import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

/**
 * DTO for creating an analysis with AI generation
 * Extends base CreateAnalysisDTO with AI-specific parameters
 */
export class CreateAiAnalysisDTO {
  @ApiProperty({
    description: 'ID of the writing to analyze',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'Writing ID is required' })
  @IsUUID('4', { message: 'Writing ID must be a valid UUID' })
  writingId: string;

  @ApiProperty({
    description: 'Whether to trigger AI analysis (default: true)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'triggerAi must be a boolean' })
  triggerAi: boolean = true;

  @ApiProperty({
    description:
      'Type of writing (determines analysis focus and prompt strategy)',
    enum: ['journal', 'social_essay', 'blog_post', 'short_story', 'article'],
    example: 'journal',
    required: false,
  })
  @IsOptional()
  @IsEnum(['journal', 'social_essay', 'blog_post', 'short_story', 'article'], {
    message: 'Invalid writing type',
  })
  writingType?: string;

  @ApiProperty({
    description: 'Optional initial feedback (can be combined with AI analysis)',
    example: {
      userNotes: 'Focus on clarity',
    },
    required: false,
  })
  @IsOptional()
  feedbackJson?: Record<string, any>;
}
