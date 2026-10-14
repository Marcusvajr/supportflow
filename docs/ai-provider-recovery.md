# Diagnóstico do resumo por IA no Render

## Estado observado (14/10/2026)

O endpoint autenticado `POST /api/v1/tickets/:id/ai-summary` existe, mas em três tentativas do dia 14/10/2026 retornou HTTP 503. Os logs antigos não distinguem falta de credencial, recusa do provedor, erro de rede ou limite de uso. **Não existe ainda evidência de geração real bem-sucedida.**

## Observabilidade adicionada

No início da API, o NestJS escreve uma linha **sem segredos**:

- `ai_summary_config credential=missing endpoint=openrouter_default`: falta a chave no serviço.
- `ai_summary_config credential=present ...`: há uma chave configurada, mas isso não comprova que seja válida.

Quando alguém solicita um resumo, os logs podem indicar:

| Evento nos logs | Significado | Próxima ação |
| --- | --- | --- |
| `reason=missing_credential` | Nenhuma chave configurada | Configurar variável secreta no backend Render |
| `reason=provider_http status=401` | Credencial rejeitada | Confirmar chave e provedor correto |
| `reason=provider_http status=402` | Créditos insuficientes | Escolher um modelo gratuito válido ou regularizar créditos |
| `reason=provider_http status=429` | Limite de uso | Aguardar o intervalo ou conferir limite da conta |
| `reason=provider_http status=400` | Requisição/modelo inválido | Conferir `AI_MODEL` e compatibilidade da API |
| `reason=provider_http status=5xx` | Indisponibilidade do provedor | Conferir a página de status e tentar novamente |
| `reason=timeout` / `reason=network_error` | Falha de transporte | Testar alcance do endpoint e latência |
| `reason=invalid_json` / `reason=invalid_content` | Resposta fora do contrato esperado | Conferir formato OpenAI-compatible do provedor |

Os logs **não** gravam chaves, payloads dos chamados, nomes de clientes ou corpo de resposta do provedor.

## Configuração

A aplicação usa por padrão `https://openrouter.ai/api/v1/chat/completions`, mas aceita qualquer URL compatível via `AI_PROVIDER_URL`. São lidas, exclusivamente no backend:

- `OPENROUTER_API_KEY` (ou `AI_API_KEY`) — **segredo; inserir somente no painel Render da API**.
- `AI_PROVIDER_URL` — URL da API; omitir para usar a padrão.
- `AI_MODEL` — identificador do modelo. Para teste sem tarifa por token no OpenRouter, considerar `openrouter/free` **com limites e disponibilidade próprios**, conforme https://openrouter.ai/openrouter/free; pode ser necessário confirmar as políticas do provedor e o envio dos dados.

Não cole a chave no chat, no GitHub, em slides ou no frontend. Não envie uma chave da OmniRoute ao endpoint da OpenRouter sem confirmar a compatibilidade do provedor e a URL correta.

## Demora durante a geração (14/10/2026)

Após configurar `OPENROUTER_API_KEY` no Render, a requisição ao modelo `openrouter/free` retornou **503 após cerca de 15,6 segundos**, com a categoria `invalid_json`. O código tinha um `AbortSignal.timeout(15000)` compartilhado pela solicitação e pela leitura da resposta; quando o limite ocorria na fase de `response.json()`, a exceção era classificada incorretamente.

A alteração de 14/10 aumenta o limite único para **60 segundos**, especifica `stream: false` e registra `reason=timeout phase=response_body` em vez de `invalid_json` quando a leitura é abortada. Não altera credenciais, modelo nem dados dos chamados.

O modelo `openrouter/free` seleciona provedores gratuitos, cuja latência pode variar. Caso a requisição exceda 60 segundos ou retorne outro erro, verificar os novos logs e evitar prometer que a geração está validada sem uma resposta HTTP 200.

## Critério de aceite

1. Render registra `credential=present`.
2. Teste com dados **fictícios**, usando uma sessão autenticada.
3. Requisição retorna HTTP 200, `summary`, `provider`, `generatedAt` e `disclaimer`.
4. O texto corresponde aos fatos registrados e não inventa procedimentos.
5. Nenhum status, responsável, prioridade ou registro do chamado é modificado.
6. Validar CORS, disponibilidade, custo/limites e tratamento de erro.

A aprovação de CI com um provider simulado **não** substitui o teste real com credencial externa.
