import { type MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { AccessLogger } from './common/access-logger';
import { ProblemDetailsFilter } from './common/problem-details.filter';
import { RequestContextMiddleware } from './common/request-context.middleware';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthController } from './health/health.controller';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [AuthModule, CustomersModule, TicketsModule, DashboardModule, AiModule],
  controllers: [HealthController],
  providers: [AccessLogger, RequestContextMiddleware, { provide: APP_FILTER, useClass: ProblemDetailsFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
