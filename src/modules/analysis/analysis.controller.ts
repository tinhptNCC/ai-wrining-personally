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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/types';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDTO, QueryAnalysisDTO, UpdateAnalysisDTO } from './dto';

@ApiTags('analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  /**
   * Create a new analysis for a writing
   */
  @Post()
  async create(@Body() dto: CreateAnalysisDTO, @Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    return this.analysisService.create(userId, dto);
  }

  /**
   * Get all analyses for the current user
   */
  @Get()
  async findAll(@Query() query: QueryAnalysisDTO, @Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    return this.analysisService.findAll(userId, query);
  }

  /**
   * Get a single analysis by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    return this.analysisService.findOne(id, userId);
  }

  /**
   * Get all analyses for a specific writing
   */
  @Get('writing/:writingId')
  async findByWritingId(
    @Param('writingId') writingId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId;
    return this.analysisService.findByWritingId(writingId, userId);
  }

  /**
   * Update an analysis
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnalysisDTO,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId;
    return this.analysisService.update(id, userId, dto);
  }

  /**
   * Delete an analysis
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    const userId = req.user?.userId;
    return this.analysisService.remove(id, userId);
  }

  /**
   * Get analysis statistics
   */
  @Get('stats/overview')
  async getStats(@Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    return this.analysisService.getStats(userId);
  }
}
