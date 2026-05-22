import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfiguration } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WritingsModule } from './modules/writings/writings.module';
import { AnalysisModule } from './modules/analysis/analysis.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfiguration,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    WritingsModule,
    AnalysisModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
