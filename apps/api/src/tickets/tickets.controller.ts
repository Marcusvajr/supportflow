import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '../users/user';
import type { CreateTicketInput } from './ticket';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(@Inject(TicketsService) private readonly tickets: TicketsService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: string,
  ) {
    return this.tickets.list(q, status, priority, category, assignedTo, page, pageSize, sortBy, sortDirection);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() input: CreateTicketInput) {
    return this.tickets.create(user, input);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.tickets.get(id);
  }

  @Patch(':id/status')
  changeStatus(@CurrentUser() user: User, @Param('id') id: string, @Body('status') status: unknown) {
    return this.tickets.changeStatus(user, id, status);
  }

  @Patch(':id/priority')
  changePriority(@CurrentUser() user: User, @Param('id') id: string, @Body('priority') priority: unknown) {
    return this.tickets.changePriority(user, id, priority);
  }

  @Patch(':id/assignee')
  assign(@CurrentUser() user: User, @Param('id') id: string, @Body('assignedToUserId') assignedToUserId: unknown) {
    return this.tickets.assign(user, id, assignedToUserId);
  }

  @Post(':id/resolve')
  resolve(@CurrentUser() user: User, @Param('id') id: string, @Body('resolution') resolution: unknown) {
    return this.tickets.resolve(user, id, resolution);
  }

  @Post(':id/activities')
  addActivity(@CurrentUser() user: User, @Param('id') id: string, @Body('type') type: unknown, @Body('description') description: unknown) {
    return this.tickets.addActivity(user, id, type, description);
  }

  @Get(':id/timeline')
  timeline(@Param('id') id: string) {
    return this.tickets.timeline(id);
  }
}
