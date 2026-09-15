import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { isUserRole, type User } from './user';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(@Inject(UsersRepository) private readonly repository: UsersRepository) {}

  async resolveActiveUser(externalAuthId: string): Promise<User> {
    const user = await this.repository.findByExternalAuthId(externalAuthId);
    if (!user || !user.active || !isUserRole(user.role)) {
      throw new ForbiddenException('Acesso indisponível. Entre em contato com o supervisor.');
    }
    return user;
  }
}
