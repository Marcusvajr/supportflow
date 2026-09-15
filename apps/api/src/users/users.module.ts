import { Module } from '@nestjs/common';
import { demoUsers, InMemoryUsersRepository } from './in-memory-users.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [
    { provide: UsersRepository, useFactory: () => new InMemoryUsersRepository(demoUsers(process.env)) },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
