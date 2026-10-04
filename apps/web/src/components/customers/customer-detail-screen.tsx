'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ApiError, createApiClient } from '../../lib/api-client';
import type { Customer } from '../../lib/customer-types';

export function CustomerDetailScreen() {
  const params = useParams<{ id: string }>();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'not-found' | 'error'>('loading');

  const api = useCallback(() => createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    getToken,
    onUnauthorized: () => signOut({ redirectUrl: '/sign-in' }),
    onForbidden: () => router.replace('/access-unavailable'),
  }), [getToken, router, signOut]);

  const load = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !params.id) return;
    setStatus('loading');
    try {
      const result = await api().request<Customer>(`/customers/${encodeURIComponent(params.id)}`);
      setCustomer(result);
      setStatus('ready');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) setStatus('not-found');
      else if (!(error instanceof ApiError && [401, 403].includes(error.status))) setStatus('error');
    }
  }, [api, isLoaded, isSignedIn, params.id]);

  useEffect(() => { void load(); }, [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer) return;
    setStatus('saving');
    try {
      const updated = await api().request<Customer>(`/customers/${encodeURIComponent(customer.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceCode: customer.referenceCode,
          name: customer.name,
          documentMasked: customer.documentMasked,
          phoneMasked: customer.phoneMasked,
          city: customer.city,
        }),
      });
      setCustomer(updated);
      setStatus('ready');
    } catch (error) {
      if (!(error instanceof ApiError && [401, 403].includes(error.status))) setStatus('error');
    }
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div><p className="page-kicker">Cliente</p><h1>{customer?.name ?? 'Detalhes do cliente'}</h1><p className="section-lead">Atualize os dados fictícios usados nos atendimentos.</p></div>
        <Link className="secondary-action" href="/customers">Voltar para clientes</Link>
      </header>
      {status === 'loading' && <section className="auth-panel" role="status">Carregando cliente…</section>}
      {status === 'not-found' && <section className="auth-panel" role="alert"><h2>Cliente não encontrado</h2><p>O cadastro solicitado não existe.</p></section>}
      {status === 'error' && <section className="auth-panel" role="alert"><h2>Não foi possível carregar o cliente</h2><button className="secondary-action" type="button" onClick={() => void load()}>Tentar novamente</button></section>}
      {customer && status !== 'loading' && status !== 'not-found' && (
        <section className="auth-panel">
          <p className="eyebrow">Dados fictícios de demonstração</p>
          <form className="form-grid" onSubmit={save}>
            <label>Código de referência<input required maxLength={40} value={customer.referenceCode} onChange={(e) => setCustomer({ ...customer, referenceCode: e.target.value })} /></label>
            <label>Nome<input required minLength={2} maxLength={120} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></label>
            <label>Documento mascarado<input maxLength={30} value={customer.documentMasked ?? ''} onChange={(e) => setCustomer({ ...customer, documentMasked: e.target.value || null })} /></label>
            <label>Telefone mascarado<input maxLength={30} value={customer.phoneMasked ?? ''} onChange={(e) => setCustomer({ ...customer, phoneMasked: e.target.value || null })} /></label>
            <label>Cidade<input maxLength={80} value={customer.city ?? ''} onChange={(e) => setCustomer({ ...customer, city: e.target.value || null })} /></label>
            <div className="form-actions"><button className="primary-action" disabled={status === 'saving'} type="submit">{status === 'saving' ? 'Salvando…' : 'Salvar alterações'}</button></div>
          </form>
        </section>
      )}
    </main>
  );
}
