import { Controller, Get, Inject } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';

@Controller('dashboard')
export class DashboardController {
  constructor(@Inject(TicketsService) private readonly tickets: TicketsService) {}

  @Get('summary')
  summary() {
    return this.tickets.summary();
  }
}
