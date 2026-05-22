import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { WritingTypeEnum, WritingStatusEnum } from '../enum';

export class UpdateWritingDTO {
  @ApiProperty({
    description: 'Title of the writing',
    example: 'Updated Journal Entry',
    minLength: 3,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @ApiProperty({
    description: 'Content of the writing',
    example: 'Updated content...',
    minLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content?: string;

  @ApiProperty({
    description: 'Type of writing',
    enum: WritingTypeEnum,
    example: WritingTypeEnum.JOURNAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(WritingTypeEnum, {
    message: `Type must be one of: ${Object.values(WritingTypeEnum).join(', ')}`,
  })
  type?: WritingTypeEnum;

  @ApiProperty({
    description: 'Status of the writing',
    enum: WritingStatusEnum,
    example: WritingStatusEnum.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(WritingStatusEnum, {
    message: `Status must be one of: ${Object.values(WritingStatusEnum).join(', ')}`,
  })
  status?: WritingStatusEnum;
}
