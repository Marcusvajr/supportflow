import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { isUserRole, type User } from './user';
import { UsersRepository } from './users.repository';

export type AssignableUser = Pick<User, 'id' | 'name' | 'role'>;

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

  async findActiveById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user || !user.active || !isUserRole(user.role)) {
      throw new NotFoundException('Usuário responsável não encontrado.');
    }
    return user;
  }

  async listAssignable(): Promise<AssignableUser[]> {
    const users = await this.repository.listActive();
    return users
      .filter((user) => isUserRole(user.role))
      .map(({ id, name, role }) => ({ id, name, role }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }
}
