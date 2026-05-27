import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { WritingTypeEnum, WritingStatusEnum } from '../enum';

export class CreateWritingDTO {
  @ApiProperty({
    description: 'Title of the writing',
    example: 'My First Journal Entry',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @ApiProperty({
    description: 'Content of the writing',
    example: 'Today was a great day...',
    minLength: 10,
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content: string;

  @ApiProperty({
    description: 'Type of writing',
    enum: WritingTypeEnum,
  })
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(WritingTypeEnum, {
    message: `Type must be one of: ${Object.values(WritingTypeEnum).join(', ')}`,
  })
  type: WritingTypeEnum;

  @ApiProperty({
    description: 'Status of the writing',
    enum: WritingStatusEnum,
    example: WritingStatusEnum.DRAFT,
    required: false,
    default: WritingStatusEnum.DRAFT,
  })
  @IsOptional()
  @IsEnum(WritingStatusEnum, {
    message: `Status must be one of: ${Object.values(WritingStatusEnum).join(', ')}`,
  })
  status?: WritingStatusEnum;
}
