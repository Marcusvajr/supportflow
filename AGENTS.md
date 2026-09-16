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

## Estado da stack

### Em uso nesta entrega
- Frontend: Next.js + React + TypeScript.
- Backend: Node.js + NestJS + TypeScript.
- Auth: Clerk com RBAC `AGENT` e `SUPERVISOR` aplicado no backend.
- Testes E2E/aceite: Playwright.
- CI: GitHub Actions.
- Inspeção de código: SonarQube.

### Planejada para as próximas changes
- Estilização: Tailwind CSS.
- Banco: PostgreSQL no Supabase.
- ORM: Prisma.
- Observabilidade: Sentry + logs estruturados.
- Publicação do frontend: Vercel.
- Containers da aplicação e Infraestrutura como Código.

Não trate itens planejados como já implementados. O estado atual da entrega está resumido no `README.md` e em `docs/delivery-configuration.md`.

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
- Quando a persistência com Prisma estiver implementada, use migrations para alterações de schema.
- Registre mudanças relevantes do chamado no histórico/auditoria quando esse domínio estiver implementado.
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

## Comandos atuais

```bash
npm ci
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
```

Comandos de Prisma (`prisma migrate`, `prisma generate`) só passam a fazer parte do fluxo quando a persistência correspondente for implementada.

## Qualidade e testes
- Backend: meta inicial de 70% nas camadas de negócio quando houver cobertura instrumentada.
- Toda regra relevante deve cobrir Happy Path, Sad Path e Edge Cases.
- Fluxos críticos devem ter E2E no Playwright.
- Mudança funcional não é concluída sem testes correspondentes.
- Evite `console.log()` como logging de produção; use logs estruturados quando a camada de observabilidade for implementada.

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
- `docs/architecture.md`: arquitetura-alvo e segurança.
- `docs/design.md`: design system e interfaces.
- `docs/delivery-configuration.md`: estado executado das seções 1 a 6.

## Aprendizado contínuo
Ao concluir uma mudança relevante:
- identifique uma melhoria de processo ou contexto, se houver;
- proponha ajuste em `AGENTS.md` apenas quando a regra for recorrente e reutilizável;
- evite duplicar instruções já existentes.
