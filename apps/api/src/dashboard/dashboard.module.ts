import { Module } from '@nestjs/common';
import { TicketsModule } from '../tickets/tickets.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TicketsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
