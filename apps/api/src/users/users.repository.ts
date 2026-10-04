import type { User } from './user';

export abstract class UsersRepository {
  abstract findByExternalAuthId(externalAuthId: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract listActive(): Promise<User[]>;
}
