'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ApiError, createApiClient } from '../../lib/api-client';
import type { CustomerPage } from '../../lib/customer-types';

type FormState = {
  referenceCode: string;
  name: string;
  documentMasked: string;
  phoneMasked: string;
  city: string;
};

const emptyForm: FormState = { referenceCode: '', name: '', documentMasked: '', phoneMasked: '', city: '' };

export function CustomersScreen() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [data, setData] = useState<CustomerPage | null>(null);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'error'>('loading');

  const api = useCallback(() => createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    getToken,
    onUnauthorized: () => signOut({ redirectUrl: '/sign-in' }),
    onForbidden: () => router.replace('/access-unavailable'),
  }), [getToken, router, signOut]);

  const load = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setStatus('loading');
    try {
      const params = new URLSearchParams({ page: '1', pageSize: '20' });
      if (submittedQuery) params.set('q', submittedQuery);
      const page = await api().request<CustomerPage>(`/customers?${params.toString()}`);
      setData(page);
      setStatus('ready');
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setStatus('error');
    }
  }, [api, isLoaded, isSignedIn, submittedQuery]);

  useEffect(() => { void load(); }, [load]);

  async function submitCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    try {
      await api().request('/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceCode: form.referenceCode,
          name: form.name,
          documentMasked: form.documentMasked || null,
          phoneMasked: form.phoneMasked || null,
          city: form.city || null,
        }),
      });
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setStatus('error');
    }
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div>
          <p className="page-kicker">Relacionamento</p>
          <h1>Clientes</h1>
          <p className="section-lead">Cadastros fictícios usados nos chamados da demonstração acadêmica.</p>
        </div>
        <div className="header-actions">
          <button className="primary-action" type="button" onClick={() => setShowForm((value) => !value)}>
            {showForm ? 'Cancelar' : 'Novo cliente'}
          </button>
        </div>
      </header>

      {showForm && (
        <section className="auth-panel">
          <h2>Novo cliente fictício</h2>
          <form className="form-grid" onSubmit={submitCustomer}>
            <label>Código de referência<input required maxLength={40} value={form.referenceCode} onChange={(e) => setForm({ ...form, referenceCode: e.target.value })} placeholder="DEMO-003" /></label>
            <label>Nome<input required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cliente Demonstração" /></label>
            <label>Documento mascarado<input maxLength={30} value={form.documentMasked} onChange={(e) => setForm({ ...form, documentMasked: e.target.value })} placeholder="***.***.***-00" /></label>
            <label>Telefone mascarado<input maxLength={30} value={form.phoneMasked} onChange={(e) => setForm({ ...form, phoneMasked: e.target.value })} placeholder="(31) *****-0000" /></label>
            <label>Cidade<input maxLength={80} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lagoa Santa" /></label>
            <div className="form-actions"><button className="primary-action" disabled={status === 'saving'} type="submit">{status === 'saving' ? 'Salvando…' : 'Cadastrar cliente'}</button></div>
          </form>
        </section>
      )}

      <section className="auth-panel">
        <div className="toolbar">
          <form onSubmit={(event) => { event.preventDefault(); setSubmittedQuery(query.trim()); }}>
            <label className="search-field">Buscar cliente<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nome ou código" /></label>
            <button className="secondary-action" type="submit">Buscar</button>
          </form>
          {data && <span className="muted-text">{data.total} cliente(s)</span>}
        </div>

        {status === 'loading' && <p role="status">Carregando clientes…</p>}
        {status === 'error' && <div role="alert"><p>Não foi possível carregar os clientes.</p><button className="secondary-action" type="button" onClick={() => void load()}>Tentar novamente</button></div>}
        {status === 'ready' && data?.items.length === 0 && (
          <div className="empty-state compact">
            <span className="empty-icon">SF</span>
            <div><strong>Nenhum cliente encontrado</strong><p>Cadastre um cliente fictício para iniciar um atendimento.</p></div>
          </div>
        )}
        {status === 'ready' && data && data.items.length > 0 && (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Código</th><th>Nome</th><th>Cidade</th><th>Contato</th><th></th></tr></thead>
              <tbody>
                {data.items.map((customer) => (
                  <tr key={customer.id}>
                    <td><strong>{customer.referenceCode}</strong></td>
                    <td>{customer.name}</td>
                    <td>{customer.city ?? '—'}</td>
                    <td>{customer.phoneMasked ?? '—'}</td>
                    <td><Link href={`/customers/${customer.id}`}>Ver detalhes</Link></td>
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
