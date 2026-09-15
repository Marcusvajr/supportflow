'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError, createApiClient, type CurrentUser } from '../../lib/api-client';
import { CurrentUserPanel } from './current-user-panel';
import { SignOut } from './sign-out';

type ProfileState = { status: 'loading' | 'redirecting' | 'error' } | { status: 'ready'; user: CurrentUser; clerkUserId: string };

export function Dashboard() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({ status: 'loading' });
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
        if (controller.signal.aborted) return;
        // Encerrar a sessão também evita um loop login → /me 401 → login.
        await signOut({ redirectUrl: '/sign-in' });
      },
      onForbidden: () => { if (!controller.signal.aborted) router.replace('/access-unavailable'); },
    });
    api.request<CurrentUser>('/me', { signal: controller.signal })
      .then((user) => { if (!controller.signal.aborted) setState({ status: 'ready', user, clerkUserId: userId }); })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: error instanceof ApiError && [401, 403].includes(error.status) ? 'redirecting' : 'error' });
        }
      });
    return () => controller.abort();
  }, [isLoaded, isSignedIn, userId, getToken, signOut, router, attempt]);

  return (
    <main className="workspace-shell">
      <header className="workspace-header"><div><p className="brand">SupportFlow</p><h1>Dashboard</h1></div><SignOut /></header>
      {(!isLoaded || !isSignedIn || state.status === 'loading' || state.status === 'redirecting'
        || (state.status === 'ready' && state.clerkUserId !== userId)) && (
        <section className="auth-panel" role="status" aria-live="polite">Verificando seu acesso…</section>
      )}
      {isLoaded && isSignedIn && state.status === 'ready' && state.clerkUserId === userId && <CurrentUserPanel user={state.user} />}
      {isLoaded && isSignedIn && state.status === 'error' && (
        <section className="auth-panel" role="alert">
          <h2>Não foi possível carregar seu acesso</h2>
          <p>Verifique sua conexão e tente novamente.</p>
          <button className="primary-action" type="button" onClick={() => { setState({ status: 'loading' }); setAttempt((value) => value + 1); }}>Tentar novamente</button>
        </section>
      )}
    </main>
  );
}
