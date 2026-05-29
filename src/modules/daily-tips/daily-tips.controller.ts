import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DailyTipsService } from './daily-tips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('daily-tips')
@UseGuards(JwtAuthGuard)
export class DailyTipsController {
  constructor(private readonly dailyTipsService: DailyTipsService) {}

  /**
   * Get today's daily tip
   */
  @Get('today')
  async getTodaysTip(@Request() req: any) {
    const tip = await this.dailyTipsService.getDailyTip(req.user.userId);
    return { data: tip };
  }

  /**
   * Get all user's daily tips with pagination
   */
  @Get()
  async getUserTips(
    @Request() req: any,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const result = await this.dailyTipsService.getUserTips(
      req.user.userId,
      parseInt(limit),
      parseInt(offset),
    );
    return result;
  }

  /**
   * Get tips by category
   */
  @Get('category/:category')
  async getTipsByCategory(
    @Request() req: any,
    @Param('category') category: string,
  ) {
    const tips = await this.dailyTipsService.getTipsByCategory(
      req.user.userId,
      category,
    );
    return { data: tips };
  }

  /**
   * Get unread tips count
   */
  @Get('unread/count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.dailyTipsService.getUnreadTipsCount(
      req.user.userId,
    );
    return { count };
  }

  /**
   * Mark a tip as read
   */
  @Patch(':id/mark-as-read')
  async markAsRead(@Param('id') tipId: string, @Request() req: any) {
    const tip = await this.dailyTipsService.markTipAsRead(
      tipId,
      req.user.userId,
    );
    return { data: tip };
  }

  /**
   * Generate and get daily tip (if not already created today)
   */
  @Post('generate')
  async generateDailyTip(
    @Request() req: any,
    @Query('categories') categories?: string,
  ) {
    const categoryList = categories
      ? categories.split(',')
      : ['grammar', 'vocabulary', 'punctuation'];
    const tip = await this.dailyTipsService.generateDailyTip(
      req.user.userId,
      categoryList,
    );
    return { data: tip };
  }
}
