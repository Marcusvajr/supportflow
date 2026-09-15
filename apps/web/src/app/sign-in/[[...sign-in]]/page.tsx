import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <header className="auth-intro">
        <Link className="brand" href="/">SupportFlow</Link>
        <h1>Acesse sua central de suporte</h1>
        <p>Entre com sua conta de trabalho para dar continuidade aos atendimentos.</p>
      </header>
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/dashboard" withSignUp={false}
          appearance={{
            variables: { colorPrimary: '#2563EB', borderRadius: '6px' },
            elements: {
              headerTitle: { display: 'none' },
              footerAction: { display: 'none' },
              cardBox: { boxShadow: 'none', border: '1px solid #E2E8F0' },
            },
          }} />
      ) : (
        <section className="auth-panel" role="alert">
          <h2>Autenticação indisponível</h2>
          <p>A integração de autenticação precisa ser configurada pelo responsável pelo ambiente.</p>
        </section>
      )}
      <p className="auth-note">Acesso exclusivo a usuários cadastrados no SupportFlow.</p>
    </main>
  );
}
