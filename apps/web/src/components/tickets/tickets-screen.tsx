'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ApiError, createApiClient } from '../../lib/api-client';
import { priorityLabels, statusLabels, type TicketPage, type TicketPriority, type TicketStatus } from '../../lib/ticket-types';

export function TicketsScreen() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [data, setData] = useState<TicketPage | null>(null);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  const api = useCallback(() => createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    getToken,
    onUnauthorized: () => signOut({ redirectUrl: '/sign-in' }),
    onForbidden: () => router.replace('/access-unavailable'),
  }), [getToken, router, signOut]);

  const load = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setState('loading');
    try {
      const params = new URLSearchParams({ page: '1', pageSize: '20' });
      if (submittedQuery) params.set('q', submittedQuery);
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      const page = await api().request<TicketPage>(`/tickets?${params.toString()}`);
      setData(page);
      setState('ready');
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setState('error');
    }
  }, [api, isLoaded, isSignedIn, submittedQuery, statusFilter, priorityFilter]);

  useEffect(() => { void load(); }, [load]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div>
          <p className="page-kicker">Atendimento</p>
          <h1>Chamados</h1>
          <p className="section-lead">Acompanhe o ciclo técnico dos atendimentos de demonstração.</p>
        </div>
        <div className="header-actions">
          <Link className="primary-action" href="/tickets/new">Novo chamado</Link>
        </div>
      </header>

      <section className="auth-panel">
        <div className="ticket-filters">
          <form onSubmit={submitSearch}>
            <label className="search-field">Buscar chamado<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Protocolo ou título" /></label>
            <button className="secondary-action" type="submit">Buscar</button>
          </form>
          <label className="filter-field">Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as TicketStatus | '')}>
              <option value="">Todos</option>
              <option value="OPEN">Aberto</option>
              <option value="DIAGNOSING">Em diagnóstico</option>
              <option value="ESCALATED">Encaminhado</option>
              <option value="RESOLVED">Resolvido</option>
            </select>
          </label>
          <label className="filter-field">Prioridade
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as TicketPriority | '')}>
              <option value="">Todas</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </label>
        </div>

        {data && state === 'ready' && <p className="muted-text">{data.total} chamado(s)</p>}
        {state === 'loading' && <p role="status">Carregando chamados…</p>}
        {state === 'error' && <div role="alert"><p>Não foi possível carregar os chamados.</p><button className="secondary-action" type="button" onClick={() => void load()}>Tentar novamente</button></div>}
        {state === 'ready' && data?.items.length === 0 && (
          <div className="empty-state compact">
            <span className="empty-icon">SF</span>
            <div><strong>Nenhum chamado encontrado</strong><p>Ajuste os filtros ou crie um novo atendimento.</p></div>
            <Link className="primary-action" href="/tickets/new">Novo chamado</Link>
          </div>
        )}
        {state === 'ready' && data && data.items.length > 0 && (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Protocolo</th><th>Cliente</th><th>Título</th><th>Prioridade</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {data.items.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.protocol}</strong></td>
                    <td>{ticket.customerName}</td>
                    <td>{ticket.title}</td>
                    <td><span className={`badge priority-${ticket.priority.toLowerCase()}`}>{priorityLabels[ticket.priority]}</span></td>
                    <td><span className={`badge status-${ticket.status.toLowerCase()}`}>{statusLabels[ticket.status]}</span></td>
                    <td><Link href={`/tickets/${ticket.id}`}>Abrir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
