import type { CurrentUser } from '../../lib/api-client';

type CurrentUserPanelProps = Readonly<{
  user: CurrentUser;
}>;

export function CurrentUserPanel({ user }: CurrentUserPanelProps) {
  return (
    <section className="auth-panel" aria-labelledby="current-user-title">
      <p className="eyebrow">Seu acesso está ativo</p>
      <h2 id="current-user-title">Olá, {user.name}</h2>
      <dl className="profile-details">
        <div><dt>E-mail</dt><dd>{user.email}</dd></div>
        <div><dt>Perfil</dt><dd>{user.role === 'SUPERVISOR' ? 'Supervisor' : 'Atendente'}</dd></div>
      </dl>
      <p>Este é o ponto de entrada da sua central. Os indicadores e a fila de chamados serão disponibilizados nas próximas etapas.</p>
    </section>
  );
}
