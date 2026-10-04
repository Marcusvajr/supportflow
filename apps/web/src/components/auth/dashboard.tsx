'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, createApiClient, type CurrentUser } from '../../lib/api-client';
import type { CustomerPage } from '../../lib/customer-types';
import { priorityLabels, statusLabels, type TicketPage } from '../../lib/ticket-types';
import { CurrentUserPanel } from './current-user-panel';

type DashboardData = {
  user: CurrentUser;
  clerkUserId: string;
  tickets: TicketPage;
  customers: CustomerPage;
};

type DashboardState =
  | { status: 'loading' | 'redirecting' | 'error' }
  | { status: 'ready'; data: DashboardData };

export function Dashboard() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    const controller = new AbortController();
    const api = createApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      getToken,
      onUnauthorized: async () => {
        if (!controller.signal.aborted) await signOut({ redirectUrl: '/sign-in' });
      },
      onForbidden: () => { if (!controller.signal.aborted) router.replace('/access-unavailable'); },
    });

    Promise.all([
      api.request<CurrentUser>('/me', { signal: controller.signal }),
      api.request<TicketPage>('/tickets?page=1&pageSize=100', { signal: controller.signal }),
      api.request<CustomerPage>('/customers?page=1&pageSize=100', { signal: controller.signal }),
    ])
      .then(([user, tickets, customers]) => {
        if (!controller.signal.aborted) setState({ status: 'ready', data: { user, tickets, customers, clerkUserId: userId } });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: error instanceof ApiError && [401, 403].includes(error.status) ? 'redirecting' : 'error' });
        }
      });

    return () => controller.abort();
  }, [isLoaded, isSignedIn, userId, getToken, signOut, router, attempt]);

  const metrics = useMemo(() => {
    if (state.status !== 'ready') return null;
    const tickets = state.data.tickets.items;
    return {
      open: tickets.filter((ticket) => ticket.status === 'OPEN').length,
      diagnosing: tickets.filter((ticket) => ticket.status === 'DIAGNOSING').length,
      escalated: tickets.filter((ticket) => ticket.status === 'ESCALATED').length,
      critical: tickets.filter((ticket) => ticket.priority === 'CRITICAL' && ticket.status !== 'RESOLVED').length,
    };
  }, [state]);

  const loading = !isLoaded || !isSignedIn || state.status === 'loading' || state.status === 'redirecting'
    || (state.status === 'ready' && state.data.clerkUserId !== userId);

  return (
    <main className="workspace-shell">
      <header className="page-header">
        <div className="page-title-block">
          <p className="page-kicker">Operação</p>
          <h1>Visão geral</h1>
          <p className="section-lead">Acompanhe a fila de suporte e acesse rapidamente os principais fluxos.</p>
        </div>
        <div className="header-actions">
          <Link className="secondary-action" href="/customers">Novo cliente</Link>
          <Link className="primary-action" href="/tickets/new">Novo chamado</Link>
        </div>
      </header>

      {loading && <section className="surface-card loading-card" role="status" aria-live="polite"><span className="loading-pulse" />Carregando sua central…</section>}

      {state.status === 'ready' && state.data.clerkUserId === userId && metrics && (
        <>
          <CurrentUserPanel user={state.data.user} />

          <section className="metrics-grid" aria-label="Indicadores da operação">
            <article className="metric-card">
              <span className="metric-icon metric-icon-blue">01</span>
              <div><p>Chamados abertos</p><strong>{metrics.open}</strong><span>Aguardando ou iniciando tratamento</span></div>
            </article>
            <article className="metric-card">
              <span className="metric-icon metric-icon-purple">02</span>
              <div><p>Em diagnóstico</p><strong>{metrics.diagnosing}</strong><span>Com análise técnica em andamento</span></div>
            </article>
            <article className="metric-card">
              <span className="metric-icon metric-icon-orange">03</span>
              <div><p>Encaminhados</p><strong>{metrics.escalated}</strong><span>Demandas em escalonamento</span></div>
            </article>
            <article className="metric-card">
              <span className="metric-icon metric-icon-red">!</span>
              <div><p>Críticos ativos</p><strong>{metrics.critical}</strong><span>Prioridade máxima ainda aberta</span></div>
            </article>
          </section>

          <section className="dashboard-grid">
            <div className="surface-card dashboard-list-card">
              <div className="card-heading">
                <div><p className="page-kicker">Fila recente</p><h2>Últimos chamados</h2></div>
                <Link className="text-link" href="/tickets">Ver todos</Link>
              </div>

              {state.data.tickets.items.length === 0 ? (
                <div className="empty-state compact">
                  <span className="empty-icon">SF</span>
                  <div><strong>Nenhum chamado criado</strong><p>Crie o primeiro atendimento para iniciar a fila.</p></div>
                  <Link className="primary-action" href="/tickets/new">Criar chamado</Link>
                </div>
              ) : (
                <div className="recent-list">
                  {state.data.tickets.items.slice(0, 5).map((ticket) => (
                    <Link className="recent-ticket" href={`/tickets/${ticket.id}`} key={ticket.id}>
                      <div className="recent-ticket-main">
                        <span className="protocol">{ticket.protocol}</span>
                        <strong>{ticket.title}</strong>
                        <span>{ticket.customerName}</span>
                      </div>
                      <div className="recent-ticket-meta">
                        <span className={`badge priority-${ticket.priority.toLowerCase()}`}>{priorityLabels[ticket.priority]}</span>
                        <span className={`badge status-${ticket.status.toLowerCase()}`}>{statusLabels[ticket.status]}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <aside className="dashboard-side">
              <section className="surface-card quick-actions">
                <div className="card-heading"><div><p className="page-kicker">Atalhos</p><h2>Ações rápidas</h2></div></div>
                <Link className="quick-action-link" href="/tickets/new"><span>+</span><div><strong>Novo chamado</strong><small>Iniciar atendimento técnico</small></div></Link>
                <Link className="quick-action-link" href="/customers"><span>+</span><div><strong>Novo cliente</strong><small>Cadastrar dado fictício</small></div></Link>
                <Link className="quick-action-link" href="/tickets?status=DIAGNOSING"><span>→</span><div><strong>Em diagnóstico</strong><small>Retomar casos em análise</small></div></Link>
              </section>

              <section className="surface-card environment-card">
                <div className="environment-card-head"><span className="environment-dot" /><strong>Ambiente operacional</strong></div>
                <dl>
                  <div><dt>Clientes</dt><dd>{state.data.customers.total}</dd></div>
                  <div><dt>Chamados</dt><dd>{state.data.tickets.total}</dd></div>
                  <div><dt>Persistência</dt><dd>PostgreSQL</dd></div>
                  <div><dt>Autenticação</dt><dd>Clerk</dd></div>
                </dl>
              </section>
            </aside>
          </section>
        </>
      )}

      {isLoaded && isSignedIn && state.status === 'error' && (
        <section className="surface-card error-state" role="alert">
          <span className="error-symbol">!</span>
          <div><h2>Não foi possível carregar a central</h2><p>Verifique sua conexão e tente novamente.</p></div>
          <button className="primary-action" type="button" onClick={() => { setState({ status: 'loading' }); setAttempt((value) => value + 1); }}>Tentar novamente</button>
        </section>
      )}
    </main>
  );
}
