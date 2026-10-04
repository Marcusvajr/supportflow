import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <main className="auth-layout">
      <section className="auth-brand-panel">
        <Link className="landing-brand auth-brand" href="/"><span className="brand-mark">SF</span><strong>SupportFlow</strong></Link>
        <div className="auth-brand-copy">
          <span className="status-pill light"><span className="environment-dot" />Central operacional</span>
          <h1>Continue o atendimento sem perder o contexto.</h1>
          <p>Clientes, chamados, testes, diagnósticos e histórico técnico em uma experiência única de suporte.</p>
        </div>
        <div className="auth-brand-footer">
          <div><strong>Seguro por padrão</strong><span>Autenticação externa e controle de acesso</span></div>
          <div><strong>Contexto preservado</strong><span>Linha do tempo técnica e auditoria</span></div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-heading">
            <p className="page-kicker">Acesso ao ambiente</p>
            <h2>Bem-vindo de volta</h2>
            <p>Entre com sua conta cadastrada para acessar a central.</p>
          </div>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/dashboard" withSignUp={false}
              appearance={{
                variables: {
                  colorPrimary: '#2563EB',
                  borderRadius: '10px',
                  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                  colorText: '#0F172A',
                  colorTextSecondary: '#64748B',
                },
                elements: {
                  rootBox: { width: '100%' },
                  cardBox: { width: '100%', boxShadow: 'none' },
                  card: { width: '100%', boxShadow: 'none', padding: '0', background: 'transparent' },
                  header: { display: 'none' },
                  footer: { display: 'none' },
                  footerAction: { display: 'none' },
                  formButtonPrimary: { minHeight: '46px', fontWeight: '700' },
                  formFieldInput: { minHeight: '46px', borderColor: '#D7DEE9' },
                  socialButtonsBlockButton: { minHeight: '46px', borderColor: '#D7DEE9' },
                },
              }} />
          ) : (
            <section className="surface-card" role="alert">
              <h2>Autenticação indisponível</h2>
              <p>A integração de autenticação precisa ser configurada pelo responsável pelo ambiente.</p>
            </section>
          )}
          <p className="auth-note">Acesso exclusivo a usuários cadastrados no SupportFlow.</p>
        </div>
      </section>
    </main>
  );
}
