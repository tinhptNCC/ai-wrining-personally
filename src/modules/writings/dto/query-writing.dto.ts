import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WritingTypeEnum, WritingStatusEnum } from '../enum';

export class QueryWritingDTO {
  @ApiProperty({
    description: 'Pagination limit (number of items per page)',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Pagination offset (number of items to skip)',
    example: 0,
    minimum: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Offset must be a number' })
  @Min(0, { message: 'Offset must be at least 0' })
  offset?: number = 0;

  @ApiProperty({
    description: 'Filter by writing type',
    enum: WritingTypeEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(WritingTypeEnum, {
    message: `Type must be one of: ${Object.values(WritingTypeEnum).join(', ')}`,
  })
  type?: WritingTypeEnum;

  @ApiProperty({
    description: 'Filter by writing status',
    enum: WritingStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(WritingStatusEnum, {
    message: `Status must be one of: ${Object.values(WritingStatusEnum).join(', ')}`,
  })
  status?: WritingStatusEnum;

  @ApiProperty({
    description: 'Search by title (partial match)',
    example: 'journal',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;
}
