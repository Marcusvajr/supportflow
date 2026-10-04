import { isUserRole, type User } from './user';
import { UsersRepository } from './users.repository';

export function demoUsers(env: NodeJS.ProcessEnv): User[] {
  const fixtures: User[] = [
    { id: 'demo-agent', externalAuthId: env.DEMO_AGENT_CLERK_ID ?? '', name: 'Projetos Integrados', email: 'projetos.integrados+clerk_test@example.com', role: 'AGENT', active: true },
    { id: 'demo-supervisor', externalAuthId: env.DEMO_SUPERVISOR_CLERK_ID ?? '', name: 'Sofia Supervisora', email: 'sofia@example.test', role: 'SUPERVISOR', active: true },
    { id: 'demo-inactive', externalAuthId: env.DEMO_INACTIVE_CLERK_ID ?? '', name: 'Igor Inativo', email: 'igor@example.test', role: 'AGENT', active: false },
  ];
  return fixtures.filter((user) => user.externalAuthId.trim().length > 0);
}

export class InMemoryUsersRepository extends UsersRepository {
  private readonly byExternalAuthId = new Map<string, User>();
  private readonly byId = new Map<string, User>();

  constructor(users: readonly User[]) {
    super();
    for (const user of users) {
      if (!user.externalAuthId || !isUserRole(user.role) || this.byExternalAuthId.has(user.externalAuthId) || this.byId.has(user.id)) {
        throw new Error('Configuração de usuários de demonstração inválida.');
      }
      const frozen = Object.freeze({ ...user });
      this.byExternalAuthId.set(user.externalAuthId, frozen);
      this.byId.set(user.id, frozen);
    }
  }

  async findByExternalAuthId(externalAuthId: string): Promise<User | null> {
    const user = this.byExternalAuthId.get(externalAuthId);
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.byId.get(id);
    return user ? { ...user } : null;
  }

  async listActive(): Promise<User[]> {
    return [...this.byId.values()].filter((user) => user.active).map((user) => ({ ...user }));
  }
}
