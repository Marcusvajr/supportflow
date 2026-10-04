'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, createApiClient } from '../../lib/api-client';
import { categoryLabels, priorityLabels, statusLabels, type Ticket, type TicketActivityType, type TicketPriority, type TicketStatus, type TimelineItem } from '../../lib/ticket-types';

const activityLabels: Record<TicketActivityType, string> = { NOTE: 'Observação', TEST: 'Teste', DIAGNOSIS: 'Diagnóstico' };

function metadataText(metadata: Record<string, unknown>): string {
  const from = typeof metadata.from === 'string' ? metadata.from : null;
  const to = typeof metadata.to === 'string' ? metadata.to : null;
  if (from && to) return `${from} → ${to}`;
  return '';
}

export function TicketDetailScreen() {
  const params = useParams<{ id: string }>();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'saving' | 'not-found' | 'error'>('loading');
  const [activityType, setActivityType] = useState<TicketActivityType>('TEST');
  const [activityDescription, setActivityDescription] = useState('');
  const [resolution, setResolution] = useState('');

  const api = useCallback(() => createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    getToken,
    onUnauthorized: () => signOut({ redirectUrl: '/sign-in' }),
    onForbidden: () => router.replace('/access-unavailable'),
  }), [getToken, router, signOut]);

  const load = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !params.id) return;
    setState('loading');
    try {
      const [ticketResult, timelineResult] = await Promise.all([
        api().request<Ticket>(`/tickets/${encodeURIComponent(params.id)}`),
        api().request<TimelineItem[]>(`/tickets/${encodeURIComponent(params.id)}/timeline`),
      ]);
      setTicket(ticketResult);
      setTimeline(timelineResult);
      setState('ready');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) setState('not-found');
      else if (!(error instanceof ApiError && [401, 403].includes(error.status))) setState('error');
    }
  }, [api, isLoaded, isSignedIn, params.id]);

  useEffect(() => { void load(); }, [load]);

  const nextStatuses = useMemo<TicketStatus[]>(() => {
    if (!ticket) return [];
    if (ticket.status === 'OPEN') return ['DIAGNOSING', 'ESCALATED'];
    if (ticket.status === 'DIAGNOSING') return ['ESCALATED'];
    if (ticket.status === 'ESCALATED') return ['DIAGNOSING'];
    if (ticket.status === 'RESOLVED') return ['DIAGNOSING'];
    return [];
  }, [ticket]);

  async function update(path: string, method: 'PATCH' | 'POST', body: object) {
    if (!ticket) return;
    setState('saving');
    try {
      await api().request<Ticket>(`/tickets/${encodeURIComponent(ticket.id)}${path}`, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      await load();
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setState('error');
    }
  }

  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ticket) return;
    setState('saving');
    try {
      await api().request(`/tickets/${encodeURIComponent(ticket.id)}/activities`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activityType, description: activityDescription }),
      });
      setActivityDescription('');
      await load();
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setState('error');
    }
  }

  async function resolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await update('/resolve', 'POST', { resolution });
    setResolution('');
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div><p className="page-kicker">Atendimento técnico</p><h1>{ticket?.protocol ?? 'Chamado'}</h1><p className="section-lead">{ticket ? `${ticket.customerName} · ${statusLabels[ticket.status]}` : 'Carregando contexto do atendimento…'}</p></div>
        <Link className="secondary-action" href="/tickets">Voltar para chamados</Link>
      </header>

      {state === 'loading' && <section className="auth-panel" role="status">Carregando chamado…</section>}
      {state === 'not-found' && <section className="auth-panel" role="alert"><h2>Chamado não encontrado</h2></section>}
      {state === 'error' && <section className="auth-panel" role="alert"><h2>Não foi possível carregar o chamado</h2><button className="secondary-action" type="button" onClick={() => void load()}>Tentar novamente</button></section>}

      {ticket && state !== 'loading' && state !== 'not-found' && (
        <div className="ticket-layout">
          <div className="ticket-main">
            <section className="auth-panel ticket-summary">
              <div className="ticket-title-row">
                <div><p className="eyebrow">{ticket.customerReferenceCode} · {ticket.customerName}</p><h2>{ticket.title}</h2></div>
                <div className="badge-row"><span className={`badge priority-${ticket.priority.toLowerCase()}`}>{priorityLabels[ticket.priority]}</span><span className={`badge status-${ticket.status.toLowerCase()}`}>{statusLabels[ticket.status]}</span></div>
              </div>
              <p>{ticket.description}</p>
              <dl className="profile-details">
                <div><dt>Categoria</dt><dd>{categoryLabels[ticket.category]}</dd></div>
                <div><dt>Responsável</dt><dd>{ticket.assignedToUserId ?? 'Não definido'}</dd></div>
                <div><dt>Criado em</dt><dd>{new Date(ticket.createdAt).toLocaleString('pt-BR')}</dd></div>
              </dl>
              {ticket.resolution && <div className="resolution-box"><strong>Resolução</strong><p>{ticket.resolution}</p></div>}
            </section>

            <section className="auth-panel">
              <h2>Linha do tempo</h2>
              {timeline.length === 0 && <p className="muted-text">Nenhum evento registrado.</p>}
              <div className="timeline">
                {timeline.map((item) => (
                  <article className="timeline-item" key={`${item.kind}-${item.id}`}>
                    <div>
                      <strong>{item.kind === 'activity' ? activityLabels[item.type] : item.action.replaceAll('_', ' ')}</strong>
                      <span>{new Date(item.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    {item.kind === 'activity' ? <p>{item.description}</p> : metadataText(item.metadata) && <p>{metadataText(item.metadata)}</p>}
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="ticket-sidebar">
            {ticket.status !== 'RESOLVED' && (
              <section className="auth-panel">
                <h2>Registrar atividade</h2>
                <form className="stack-form" onSubmit={addActivity}>
                  <label>Tipo<select value={activityType} onChange={(event) => setActivityType(event.target.value as TicketActivityType)}><option value="NOTE">Observação</option><option value="TEST">Teste</option><option value="DIAGNOSIS">Diagnóstico</option></select></label>
                  <label>Descrição<textarea required minLength={2} maxLength={5000} value={activityDescription} onChange={(event) => setActivityDescription(event.target.value)} /></label>
                  <button className="primary-action" disabled={state === 'saving'} type="submit">Registrar</button>
                </form>
              </section>
            )}

            <section className="auth-panel">
              <h2>Estado do chamado</h2>
              <label className="filter-field">Prioridade
                <select value={ticket.priority} onChange={(event) => void update('/priority', 'PATCH', { priority: event.target.value as TicketPriority })}>
                  <option value="LOW">Baixa</option><option value="MEDIUM">Média</option><option value="HIGH">Alta</option><option value="CRITICAL">Crítica</option>
                </select>
              </label>
              {nextStatuses.length > 0 && <div className="action-list">{nextStatuses.map((status) => <button className="secondary-action" disabled={state === 'saving'} key={status} type="button" onClick={() => void update('/status', 'PATCH', { status })}>{ticket.status === 'RESOLVED' ? 'Reabrir chamado' : `Mover para ${statusLabels[status]}`}</button>)}</div>}
            </section>

            {ticket.status !== 'RESOLVED' && ['DIAGNOSING', 'ESCALATED'].includes(ticket.status) && (
              <section className="auth-panel">
                <h2>Resolver chamado</h2>
                <form className="stack-form" onSubmit={resolve}>
                  <label>Resolução<textarea required minLength={10} maxLength={5000} value={resolution} onChange={(event) => setResolution(event.target.value)} placeholder="Descreva a solução aplicada." /></label>
                  <button className="primary-action" disabled={state === 'saving'} type="submit">Concluir atendimento</button>
                </form>
              </section>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
