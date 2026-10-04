import type { CurrentUser } from '../../lib/api-client';

type CurrentUserPanelProps = Readonly<{
  user: CurrentUser;
}>;

export function CurrentUserPanel({ user }: CurrentUserPanelProps) {
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <section className="welcome-card" aria-labelledby="current-user-title">
      <div className="welcome-copy">
        <p className="page-kicker">Seu acesso está ativo</p>
        <h2 id="current-user-title">Olá, {user.name}</h2>
        <p>Continue de onde parou ou abra um novo atendimento técnico.</p>
      </div>
      <div className="user-summary">
        <span className="user-avatar" aria-hidden="true">{initials || 'SF'}</span>
        <div>
          <strong>{user.name}</strong>
          <span>{user.role === 'SUPERVISOR' ? 'Supervisor' : 'Atendente'} · {user.email}</span>
        </div>
      </div>
    </section>
  );
}
