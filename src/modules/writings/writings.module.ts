import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Writing } from 'src/entities';
import { WritingsService } from './writings.service';
import { WritingsController } from './writings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Writing])],
  controllers: [WritingsController],
  providers: [WritingsService],
  exports: [WritingsService],
})
export class WritingsModule {}
