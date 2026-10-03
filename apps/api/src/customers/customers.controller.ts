import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { CreateCustomerInput, UpdateCustomerInput } from './customer';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  list(@Query('q') q?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.customers.list(q, page, pageSize);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.customers.get(id);
  }

  @Post()
  create(@Body() input: CreateCustomerInput) {
    return this.customers.create(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateCustomerInput) {
    return this.customers.update(id, input);
  }
}
