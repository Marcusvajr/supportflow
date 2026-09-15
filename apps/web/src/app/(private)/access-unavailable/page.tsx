import { SignOut } from '../../../components/auth/sign-out';

export default function AccessUnavailablePage() {
  return (
    <main className="auth-shell">
      <p className="brand">SupportFlow</p>
      <section className="auth-panel">
        <h1>Acesso indisponível</h1>
        <p>Sua conta foi autenticada, mas não possui acesso ativo ao SupportFlow.</p>
        <p>Entre em contato com o supervisor para verificar seu cadastro ou saia para usar outra conta.</p>
        <SignOut />
      </section>
    </main>
  );
}
