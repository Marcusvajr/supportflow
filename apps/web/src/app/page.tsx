import Link from 'next/link';

const features = [
  { number: '01', title: 'Continuidade real', text: 'Histórico técnico com testes, diagnósticos, mudanças de status e resolução em uma única linha do tempo.' },
  { number: '02', title: 'Operação organizada', text: 'Clientes, chamados, prioridades e filtros em uma interface feita para rotina de Help Desk.' },
  { number: '03', title: 'Rastreabilidade', text: 'Eventos críticos auditados e persistidos em PostgreSQL para reduzir perda de contexto entre atendentes.' },
];

export default function HomePage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <Link className="landing-brand" href="/"><span className="brand-mark">SF</span><strong>SupportFlow</strong></Link>
        <Link className="secondary-action" href="/dashboard" prefetch={false}>Acessar central</Link>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="status-pill"><span className="environment-dot" />V3 publicada</span>
          <h1>Suporte técnico com <em>contexto do início ao fim.</em></h1>
          <p>Uma central web para registrar, acompanhar e dar continuidade a chamados técnicos sem reconstruir o atendimento do zero.</p>
          <div className="landing-actions">
            <Link className="primary-action large" href="/dashboard" prefetch={false}>Entrar no SupportFlow</Link>
            <span>Ambiente acadêmico · Dados fictícios</span>
          </div>
        </div>

        <div className="landing-preview" aria-label="Prévia do produto">
          <div className="preview-window">
            <div className="preview-top"><span /><span /><span /><strong>supportflow</strong></div>
            <div className="preview-body">
              <div className="preview-sidebar">
                <div className="preview-logo">SF</div>
                <i className="active" /><i /><i /><i />
              </div>
              <div className="preview-content">
                <div className="preview-heading"><span /><small /></div>
                <div className="preview-metrics"><i /><i /><i /><i /></div>
                <div className="preview-table"><span /><span /><span /><span /></div>
              </div>
            </div>
          </div>
          <div className="floating-note"><span className="environment-dot" /><div><strong>Fluxo completo</strong><small>Cliente → chamado → diagnóstico → resolução</small></div></div>
        </div>
      </section>

      <section className="landing-features">
        {features.map((feature) => (
          <article key={feature.number}>
            <span>{feature.number}</span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <footer className="landing-footer">
        <span>SupportFlow · Projeto Integrado PUC Minas</span>
        <span>Next.js · NestJS · Clerk · Supabase</span>
      </footer>
    </main>
  );
}
