import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TicketsService } from '../src/tickets/tickets.service';
import { AiSummaryProvider } from '../src/ai/ai-summary.provider';
import { AiSummaryService } from '../src/ai/ai-summary.service';

class FakeProvider extends AiSummaryProvider {
  lastContext = '';
  async generate(context: string) {
    this.lastContext = context;
    return { text: 'Contexto resumido sem alterar o chamado.', provider: 'fake-test-model' };
  }
}

test('AI summary uses only recorded ticket context and returns an assistive disclaimer', async () => {
  const ticket = {
    id: 'ticket-1', protocol: 'SF-2026-000001', customerId: 'customer-1',
    customerName: 'Cliente Demo', customerReferenceCode: 'DEMO-001',
    title: 'Sem conexão', description: 'Cliente sem conexão após queda de energia.',
    category: 'NO_CONNECTION', status: 'DIAGNOSING', priority: 'HIGH',
    assignedToUserId: 'agent', createdByUserId: 'agent', resolution: null,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), resolvedAt: null,
  } as const;
  const timeline = [
    { id: 'a1', kind: 'activity' as const, type: 'TEST' as const, actorUserId: 'agent', description: 'Teste via cabo realizado.', createdAt: new Date().toISOString() },
  ];
  let writes = 0;
  const tickets = {
    get: async () => ticket,
    timeline: async () => timeline,
    changeStatus: async () => { writes += 1; },
  } as unknown as TicketsService;
  const provider = new FakeProvider();
  const service = new AiSummaryService(tickets, provider);

  const result = await service.summarize(ticket.id);

  assert.match(provider.lastContext, /Teste via cabo realizado/);
  assert.match(provider.lastContext, /SF-2026-000001/);
  assert.equal(result.provider, 'fake-test-model');
  assert.match(result.disclaimer, /Revise o histórico original/);
  assert.equal(writes, 0);
});
