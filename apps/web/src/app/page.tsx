import Link from 'next/link';

const foundationItems = [
  'Monorepo com npm workspaces',
  'Frontend Next.js + TypeScript',
  'Backend NestJS + TypeScript',
  'Health check versionado',
  'OpenSpec com roadmap incremental',
  'CI para lint, testes e build',
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Projeto incremental v2</p>
        <h1>SupportFlow</h1>
        <p className="lead">
          Base técnica para uma central de continuidade de chamados de suporte em provedores de internet.
        </p>
        <Link className="primary-action" href="/dashboard" prefetch={false}>Entrar no SupportFlow</Link>
      </section>

      <section className="panel" aria-labelledby="foundation-title">
        <div>
          <span className="status">Fundação em implementação</span>
          <h2 id="foundation-title">Change 01 — Project Foundation</h2>
          <p>
            Esta tela valida apenas a fundação do frontend. Regras de negócio serão implementadas no backend
            nas próximas changes do roadmap.
          </p>
        </div>

        <ul>
          {foundationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
