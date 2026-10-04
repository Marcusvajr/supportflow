import { Controller, Get, Inject } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}

  @Get('assignable')
  listAssignable() {
    return this.users.listAssignable();
  }
}
