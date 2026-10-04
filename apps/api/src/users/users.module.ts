import { Module } from '@nestjs/common';
import { demoUsers, InMemoryUsersRepository } from './in-memory-users.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: UsersRepository, useFactory: () => new InMemoryUsersRepository(demoUsers(process.env)) },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
