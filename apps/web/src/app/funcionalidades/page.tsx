import Link from 'next/link';
import { featureCatalog } from '../../lib/feature-catalog';

const statusLabel = {
  implementado: 'Implementado no sistema',
  'fluxo-a-validar': 'Implementado — teste publicado pendente',
  'externo-pendente': 'Depende de serviço externo — não validado',
} as const;

export default function FuncionalidadesPage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <Link className="landing-brand" href="/"><span className="brand-mark">SF</span><strong>SupportFlow</strong></Link>
        <Link className="secondary-action" href="/dashboard" prefetch={false}>Acessar central</Link>
      </nav>
      <section className="landing-features-intro" aria-labelledby="feature-title">
        <p className="feature-eyebrow">SUPPORTFLOW · GUIA DO PRODUTO</p>
        <h1 id="feature-title">Funcionalidades explicadas</h1>
        <p>Conheça os recursos disponíveis, como são utilizados no atendimento e quais verificações ainda dependem de um ambiente externo.</p>
      </section>
      <section className="landing-features" aria-label="Catálogo de funcionalidades">
        {featureCatalog.map((feature) => (
          <article key={feature.number}>
            <span>{feature.number}</span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
            <p className="feature-detail">{feature.detail}</p>
            <p className="feature-status">{statusLabel[feature.status]}</p>
          </article>
        ))}
      </section>
      <p className="feature-disclaimer">Ambiente acadêmico com dados fictícios. O recurso de IA apenas auxilia na leitura: consulte sempre os registros originais antes de tomar decisões.</p>
      <footer className="landing-footer"><span>SupportFlow · Projeto Integrado PUC Minas</span><Link href="/">Voltar à página inicial</Link></footer>
    </main>
  );
}
