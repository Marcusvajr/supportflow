# Casos de Teste — Login com Clerk

Este documento liga o plano de testes aos casos que já existem no código. Ele não substitui os arquivos Playwright/Jest; serve como evidência e rastreabilidade da seção 6 do Delivery.

## Casos E2E

### AUTH-E2E-01 — visitante sem sessão

**Dado** que o visitante não possui sessão ativa  
**Quando** acessa `/dashboard`  
**Então** deve ser enviado para `/sign-in` e nenhum conteúdo privado deve aparecer.

Implementação: `apps/web/tests/access.spec.ts`.

### AUTH-E2E-02 — login de AGENT ativo

**Dado** que existe uma conta fictícia Clerk associada a um usuário interno `AGENT` ativo  
**Quando** o login é realizado  
**Então** o usuário deve chegar ao dashboard e os dados de `/api/v1/me` devem ser exibidos.

Implementação: `apps/web/tests/auth.spec.ts`.

### AUTH-E2E-03 — logout

**Dado** que o AGENT está autenticado  
**Quando** seleciona **Sair da conta**  
**Então** a sessão deve ser encerrada e um novo acesso ao dashboard deve exigir login novamente.

Implementação: `apps/web/tests/auth.spec.ts`.

### AUTH-E2E-04 — usuário inativo

**Dado** que a identidade é válida no Clerk, mas o usuário interno possui `active = false`  
**Quando** o usuário tenta acessar o sistema  
**Então** o backend deve negar o acesso e o frontend deve abrir `/access-unavailable`.

Implementação: `apps/web/tests/auth.spec.ts`.

### AUTH-E2E-05 — sessão expirada / resposta 401

**Dado** que o usuário estava autenticado  
**Quando** a consulta a `/api/v1/me` passa a responder `401`  
**Então** a sessão deve ser encerrada e o usuário deve retornar ao login.

Implementação: `apps/web/tests/auth.spec.ts`.

### AUTH-E2E-06 — health do frontend

**Quando** `/api/health` é consultado sem autenticação  
**Então** deve responder `200` e continuar público.

Implementação: `apps/web/tests/access.spec.ts`.

### AUTH-E2E-07 — fundação do frontend

**Quando** a aplicação pública é aberta  
**Então** a página base do SupportFlow deve responder e permanecer utilizável sem liberar conteúdo privado.

Implementação: `apps/web/tests/foundation.spec.ts`.

### AUTH-E2E-08 — health do backend

**Quando** `/api/v1/health` é consultado sem token  
**Então** deve responder `200`.

Cobertura relacionada: Playwright + `apps/api/tests/health.test.ts`.

## Casos de backend

Os testes de backend complementam o E2E com cenários que não dependem do navegador:

- token ausente, inválido e expirado;
- assinatura e issuer inválidos;
- origem (`authorized party`) diferente da permitida;
- usuário interno desconhecido;
- usuário interno inativo;
- papel permitido e negado;
- divergência entre informação externa e papel interno;
- endpoint público com Bearer inválido;
- logs sem token ou dados indevidos;
- falha fechada quando a configuração de autenticação está incompleta.

Arquivos:

- `apps/api/tests/auth.integration.test.ts`
- `apps/api/tests/auth.test.ts`
- `apps/api/tests/roles.test.ts`
- `apps/api/tests/health.test.ts`

## Resultado registrado

Execução local completa após os ajustes da Change 02:

```text
8 passed
0 failed
```

A execução depende das contas fictícias Clerk configuradas no `.env` local. O CI padrão executa somente os smoke tests sem segredos externos.
