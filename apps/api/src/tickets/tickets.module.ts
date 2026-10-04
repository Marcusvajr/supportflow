import { Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';
import { TicketsController } from './tickets.controller';
import { TicketsRepository } from './tickets.repository';
import { TicketsService } from './tickets.service';
import { SupabaseTicketsRepository } from './supabase-tickets.repository';

@Module({
  imports: [CustomersModule, UsersModule],
  controllers: [TicketsController],
  providers: [
    { provide: TicketsRepository, useClass: SupabaseTicketsRepository },
    TicketsService,
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
