import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Writing } from 'src/entities';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/types';
import { CreateWritingDTO, QueryWritingDTO, UpdateWritingDTO } from './dto';
import { WritingsService } from './writings.service';

@ApiTags('writings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('writings')
export class WritingsController {
  constructor(private readonly writingsService: WritingsService) {}

  /**
   * Create a new writing
   */
  @Post()
  async create(@Body() dto: CreateWritingDTO, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.writingsService.create(userId, dto);
  }

  /**
   * Get all writings for the current user with pagination and filtering
   */
  @Get()
  async findAll(@Query() query: QueryWritingDTO, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.writingsService.findAll(userId, query);
  }

  /**
   * Get a single writing by ID
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Writing> {
    const userId = req.user.userId;
    return this.writingsService.findOne(id, userId);
  }

  /**
   * Update a writing
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWritingDTO,
    @Req() req: RequestWithUser,
  ): Promise<Writing> {
    const userId = req.user.userId;
    return this.writingsService.update(id, userId, dto);
  }

  /**
   * Delete a writing
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    return this.writingsService.remove(id, userId);
  }

  /**
   * Get writing statistics
   */
  @Get('stats/overview')
  async getStats(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.writingsService.getStats(userId);
  }
}
