# AGENTS.md — SupportFlow

## Prioridades
1. Segurança
2. Arquitetura e regras de negócio
3. Testes e correção
4. Simplicidade
5. Velocidade

## Antes de alterar o projeto
- Leia `docs/spec.md` e `docs/architecture.md`.
- Consulte `docs/prd.md` para comportamento de produto e `docs/design.md` para UI.
- Para APIs/frameworks atuais, consulte Context7 antes de assumir comportamento incerto.
- Faça mudanças pequenas e relacionadas à tarefa atual.

## Stack
- Frontend: Next.js + React + TypeScript + Tailwind CSS.
- Backend: Node.js + NestJS + TypeScript.
- Banco: PostgreSQL no Supabase.
- ORM: Prisma.
- Auth: Clerk com RBAC `AGENT` e `SUPERVISOR`.
- Observabilidade: Sentry + logs estruturados.
- E2E: Playwright.
- CI/CD: GitHub Actions; frontend na Vercel.

## Estrutura alvo
```text
apps/
  web/
  api/
docs/
.agents/
openspec/
```

## Limites arquiteturais
### Sempre faça
- Valide entrada e autorização no backend.
- Mantenha regras de negócio no NestJS.
- Use migrations do Prisma para alterações de schema.
- Registre mudanças relevantes do chamado no histórico/auditoria.
- Use apenas dados fictícios no ambiente acadêmico.

### Pergunte antes
- Alterar schema de banco já utilizado por outros ambientes.
- Excluir ou renomear contratos públicos da API.
- Adicionar novo serviço externo ou dependência estrutural.
- Alterar regras de permissão/papéis.

### Nunca faça
- Versionar `.env`, tokens ou segredos.
- Colocar `SUPABASE_SERVICE_ROLE`, `CLERK_SECRET_KEY` ou equivalentes no frontend.
- Acessar diretamente tabelas de negócio a partir do frontend.
- Implementar autorização apenas escondendo componentes na UI.
- Remover migrations aplicadas ou editar produção manualmente.
- Usar dados reais de assinantes no projeto acadêmico.

## API
- Prefixo: `/api/v1`.
- Formato: JSON sobre HTTPS.
- Datas: ISO 8601.
- Erros: padrão Problem Details.
- Coleções: paginação; filtros e ordenação quando aplicáveis.

## Fluxo de trabalho
1. Analise requisitos e arquivos afetados.
2. Planeje a menor mudança possível.
3. Implemente.
4. Execute validações aplicáveis.
5. Corrija falhas antes de concluir.
6. Resuma alterações, testes e riscos restantes.

## Comandos alvo
> Use estes comandos somente após os scripts correspondentes existirem no monorepo.

```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
npx prisma migrate dev
npx prisma generate
```

## Qualidade e testes
- Backend: meta inicial de 70% nas camadas de negócio.
- Toda regra relevante deve cobrir Happy Path, Sad Path e Edge Cases.
- Fluxos críticos devem ter E2E no Playwright.
- Mudança funcional não é concluída sem testes correspondentes.
- Evite `console.log()` como logging de produção; use logs estruturados.

## Terminal e autonomia
- Pode ler arquivos, criar arquivos de implementação, executar lint/test/build e comandos Git não destrutivos sem confirmação.
- Prefira comandos reproduzíveis e não interativos.
- Não execute comandos destrutivos, force push, exclusões massivas, alterações de produção ou operações irreversíveis sem autorização explícita.
- Nunca exponha valores de variáveis de ambiente nos logs ou respostas.

## Context7 MCP
- Use Context7 para documentação atualizada de Next.js, NestJS, Prisma, Supabase, Clerk e Playwright quando houver dúvida de API/versão.
- Se Context7 estiver indisponível, use a documentação oficial do fornecedor.

## Documentação de referência
- `docs/problem.md`: problema e evidências.
- `docs/prd.md`: requisitos e escopo.
- `docs/spec.md`: regras, fluxos e contratos.
- `docs/architecture.md`: decisões técnicas e segurança.
- `docs/design.md`: design system e interfaces.

## Aprendizado contínuo
Ao concluir uma mudança relevante:
- identifique uma melhoria de processo ou contexto, se houver;
- proponha ajuste em `AGENTS.md` apenas quando a regra for recorrente e reutilizável;
- evite duplicar instruções já existentes.
