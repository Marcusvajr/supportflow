import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersRepository } from './customers.repository';
import { CustomersService } from './customers.service';
import { SupabaseCustomersRepository } from './supabase-customers.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    { provide: CustomersRepository, useClass: SupabaseCustomersRepository },
    CustomersService,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
