import type { User } from './user';

export abstract class UsersRepository {
  abstract findByExternalAuthId(externalAuthId: string): Promise<User | null>;
}
