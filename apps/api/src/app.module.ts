import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessLogger } from './common/access-logger';
import { ProblemDetailsFilter } from './common/problem-details.filter';
import { HealthController } from './health/health.controller';

@Module({
  imports: [AuthModule],
  controllers: [HealthController],
  providers: [AccessLogger, { provide: APP_FILTER, useClass: ProblemDetailsFilter }],
})
export class AppModule {}
