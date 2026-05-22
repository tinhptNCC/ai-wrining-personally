import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis, Writing } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateAnalysisDTO, QueryAnalysisDTO, UpdateAnalysisDTO } from './dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>,
    @InjectRepository(Writing)
    private readonly writingRepository: Repository<Writing>,
  ) {}

  /**
   * Create a new analysis for a writing
   */
  async create(userId: string, dto: CreateAnalysisDTO): Promise<Analysis> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!dto.writingId) {
      throw new BadRequestException('Writing ID is required');
    }

    // Verify writing exists and belongs to the user
    const writing = await this.writingRepository.findOne({
      where: {
        id: dto.writingId,
        userId,
      },
    });

    if (!writing) {
      throw new NotFoundException(
        `Writing with ID ${dto.writingId} not found or you do not have access to it`,
      );
    }

    const analysis = new Analysis();
    analysis.userId = userId;
    analysis.writingId = dto.writingId;
    analysis.feedbackJson = dto.feedbackJson;

    return this.analysisRepository.save(analysis);
  }

  /**
   * Get all analyses for a user with pagination and filtering
   */
  async findAll(userId: string, query: QueryAnalysisDTO) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const { limit = 10, offset = 0, writingId } = query;

    const queryBuilder = this.analysisRepository
      .createQueryBuilder('analysis')
      .where('analysis.userId = :userId', { userId })
      .leftJoinAndSelect('analysis.writing', 'writing');

    if (writingId) {
      queryBuilder.andWhere('analysis.writingId = :writingId', { writingId });
    }

    queryBuilder.orderBy('analysis.createdAt', 'DESC').skip(offset).take(limit);

    const [analyses, total] = await queryBuilder.getManyAndCount();

    return {
      data: analyses,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    };
  }

  /**
   * Get a single analysis by ID
   */
  async findOne(id: string, userId: string): Promise<Analysis> {
    if (!id) {
      throw new BadRequestException('Analysis ID is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const analysis = await this.analysisRepository.findOne({
      where: {
        id,
        userId,
      },
      relations: {
        writing: true,
        user: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException(
        `Analysis with ID ${id} not found or you do not have access to it`,
      );
    }

    return analysis;
  }

  /**
   * Get analyses for a specific writing
   */
  async findByWritingId(writingId: string, userId: string) {
    if (!writingId) {
      throw new BadRequestException('Writing ID is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Verify writing exists and belongs to the user
    const writing = await this.writingRepository.findOne({
      where: {
        id: writingId,
        userId,
      },
    });

    if (!writing) {
      throw new NotFoundException(
        `Writing with ID ${writingId} not found or you do not have access to it`,
      );
    }

    const analyses = await this.analysisRepository.find({
      where: {
        writingId,
        userId,
      },
      order: { createdAt: 'DESC' },
    });

    return {
      writingId,
      title: writing.title,
      analyses,
      count: analyses.length,
    };
  }

  /**
   * Update an analysis
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateAnalysisDTO,
  ): Promise<Analysis> {
    if (!id) {
      throw new BadRequestException('Analysis ID is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const analysis = await this.findOne(id, userId);

    if (analysis.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this analysis',
      );
    }

    const updatedAnalysis = this.analysisRepository.merge(analysis, {
      feedbackJson:
        dto.feedbackJson !== undefined
          ? dto.feedbackJson
          : analysis.feedbackJson,
    });

    return this.analysisRepository.save(updatedAnalysis);
  }

  /**
   * Delete an analysis
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Analysis ID is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const analysis = await this.findOne(id, userId);

    if (analysis.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this analysis',
      );
    }

    await this.analysisRepository.remove(analysis);

    return {
      message: `Analysis with ID ${id} has been deleted successfully`,
    };
  }

  /**
   * Get analysis statistics for a user
   */
  async getStats(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const totalAnalyses = await this.analysisRepository.count({
      where: { userId },
    });

    const analysesWithFeedback = await this.analysisRepository.count({
      where: [{ userId, feedbackJson: true }],
    });

    return {
      totalAnalyses,
      analysesWithFeedback,
      percentageWithFeedback:
        totalAnalyses > 0
          ? Math.round((analysesWithFeedback / totalAnalyses) * 100)
          : 0,
    };
  }

  /**
   * Get analyses for multiple writings at once
   */
  async findByWritingIds(writingIds: string[], userId: string) {
    if (!writingIds || writingIds.length === 0) {
      throw new BadRequestException('Writing IDs are required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const analyses = await this.analysisRepository
      .createQueryBuilder('analysis')
      .where('analysis.userId = :userId', { userId })
      .andWhere('analysis.writingId IN (:...writingIds)', { writingIds })
      .orderBy('analysis.createdAt', 'DESC')
      .getMany();

    return {
      writingIds,
      analyses,
      count: analyses.length,
    };
  }
}
