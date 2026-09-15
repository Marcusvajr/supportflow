import { isUserRole, type User } from './user';
import { UsersRepository } from './users.repository';

// Associação explícita às identidades Clerk; nenhum usuário é criado no login.
export function demoUsers(env: NodeJS.ProcessEnv): User[] {
  const fixtures: User[] = [
    { id: 'demo-agent', externalAuthId: env.DEMO_AGENT_CLERK_ID ?? '', name: 'Ana Atendente', email: 'ana@example.test', role: 'AGENT', active: true },
    { id: 'demo-supervisor', externalAuthId: env.DEMO_SUPERVISOR_CLERK_ID ?? '', name: 'Sofia Supervisora', email: 'sofia@example.test', role: 'SUPERVISOR', active: true },
    { id: 'demo-inactive', externalAuthId: env.DEMO_INACTIVE_CLERK_ID ?? '', name: 'Igor Inativo', email: 'igor@example.test', role: 'AGENT', active: false },
  ];
  return fixtures.filter((user) => user.externalAuthId.trim().length > 0);
}

export class InMemoryUsersRepository extends UsersRepository {
  private readonly users = new Map<string, User>();

  constructor(users: readonly User[]) {
    super();
    for (const user of users) {
      if (!user.externalAuthId || !isUserRole(user.role) || this.users.has(user.externalAuthId)) {
        throw new Error('Configuração de usuários de demonstração inválida.');
      }
      this.users.set(user.externalAuthId, Object.freeze({ ...user }));
    }
  }

  async findByExternalAuthId(externalAuthId: string): Promise<User | null> {
    const user = this.users.get(externalAuthId);
    return user ? { ...user } : null;
  }
}
