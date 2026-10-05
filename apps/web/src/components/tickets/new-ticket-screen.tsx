'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ApiError, createApiClient } from '../../lib/api-client';
import type { Customer } from '../../lib/customer-types';
import { loadCustomerOptions } from '../../lib/customer-options';
import { categoryLabels, priorityLabels, type Ticket, type TicketCategory, type TicketPriority } from '../../lib/ticket-types';

type FormState = {
  customerId: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
};

export function NewTicketScreen() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [form, setForm] = useState<FormState>({ customerId: '', title: '', description: '', category: 'NO_CONNECTION', priority: 'MEDIUM' });
  const [state, setState] = useState<'loading' | 'ready' | 'saving' | 'error'>('loading');

  const api = useCallback(() => createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    getToken,
    onUnauthorized: () => signOut({ redirectUrl: '/sign-in' }),
    onForbidden: () => router.replace('/access-unavailable'),
  }), [getToken, router, signOut]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    loadCustomerOptions(api())
      .then((page) => { setCustomers(page); setState('ready'); })
      .catch((error: unknown) => {
        if (!(error instanceof ApiError && [401, 403].includes(error.status))) setState('error');
      });
  }, [api, isLoaded, isSignedIn]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('saving');
    try {
      const ticket = await api().request<Ticket>('/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      router.push(`/tickets/${ticket.id}`);
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setState('error');
    }
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div><p className="page-kicker">Novo atendimento</p><h1>Novo chamado</h1><p className="section-lead">Registre o contexto inicial para que qualquer atendente consiga dar continuidade.</p></div>
        <Link className="secondary-action" href="/tickets">Voltar para chamados</Link>
      </header>

      <section className="auth-panel">
        {state === 'loading' && <p role="status">Carregando clientes…</p>}
        {state === 'error' && <p role="alert">Não foi possível preparar o formulário. Verifique a persistência e tente novamente.</p>}
        {state !== 'loading' && customers?.length === 0 && (
          <div role="status"><h2>Cadastre um cliente primeiro</h2><p>Todo chamado precisa estar vinculado a um cliente fictício.</p><Link className="primary-action" href="/customers">Abrir clientes</Link></div>
        )}
        {customers && customers.length > 0 && (
          <form className="form-grid" onSubmit={submit}>
            <label>Cliente
              <select required value={form.customerId} onChange={(event) => setForm({ ...form, customerId: event.target.value })}>
                <option value="">Selecione</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.referenceCode} — {customer.name}</option>)}
              </select>
            </label>
            <label>Categoria
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as TicketCategory })}>
                {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label>Prioridade
              <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as TicketPriority })}>
                {Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="field-span">Título<input required minLength={5} maxLength={150} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Sem conexão após queda de energia" /></label>
            <label className="field-span">Descrição<textarea required minLength={10} maxLength={5000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descreva o problema relatado e o contexto inicial." /></label>
            <div className="form-actions"><button className="primary-action" disabled={state === 'saving'} type="submit">{state === 'saving' ? 'Criando…' : 'Criar chamado'}</button></div>
          </form>
        )}
      </section>
    </main>
  );
}
