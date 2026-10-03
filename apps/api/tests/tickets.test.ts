import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HttpException } from '@nestjs/common';
import type { Customer } from '../src/customers/customer';
import type { CustomersService } from '../src/customers/customers.service';
import type { User } from '../src/users/user';
import type { AuditEvent, CreateTicketInput, Ticket, TicketActivity, TicketActivityType, TicketPage } from '../src/tickets/ticket';
import type { PersistTicketInput, TicketListQuery, UpdateTicketPatch } from '../src/tickets/tickets.repository';
import { TicketsRepository } from '../src/tickets/tickets.repository';
import { TicketsService } from '../src/tickets/tickets.service';

const customer: Customer = {
  id: 'customer-1', referenceCode: 'DEMO-001', name: 'Cliente Demo', documentMasked: null,
  phoneMasked: null, city: 'Lagoa Santa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};
const customers = { get: async (id: string) => {
  if (id !== customer.id) throw new Error('not found');
  return customer;
} } as CustomersService;
const agent: User = { id: 'agent', externalAuthId: 'user_agent', name: 'Agente', email: 'agent@example.test', role: 'AGENT', active: true };
const supervisor: User = { ...agent, id: 'supervisor', externalAuthId: 'user_supervisor', role: 'SUPERVISOR' };

class MemoryTicketsRepository extends TicketsRepository {
  readonly items = new Map<string, Ticket>();
  readonly activities: TicketActivity[] = [];
  readonly audits: AuditEvent[] = [];
  sequence = 1;

  async list(query: TicketListQuery): Promise<TicketPage> {
    let items = [...this.items.values()];
    if (query.status) items = items.filter((item) => item.status === query.status);
    if (query.priority) items = items.filter((item) => item.priority === query.priority);
    if (query.q) items = items.filter((item) => item.protocol.includes(query.q!) || item.title.includes(query.q!));
    return { items, page: query.page, pageSize: query.pageSize, total: items.length };
  }
  async findById(id: string) { return this.items.get(id) ?? null; }
  async create(input: PersistTicketInput): Promise<Ticket> {
    const now = new Date().toISOString();
    const item: Ticket = {
      id: `ticket-${this.sequence}`, protocol: `SF-2026-${String(this.sequence++).padStart(6, '0')}`,
      customerId: input.customerId, customerName: customer.name, customerReferenceCode: customer.referenceCode,
      title: input.title, description: input.description, category: input.category, status: 'OPEN', priority: input.priority,
      assignedToUserId: input.assignedToUserId, createdByUserId: input.createdByUserId, resolution: null,
      createdAt: now, updatedAt: now, resolvedAt: null,
    };
    this.items.set(item.id, item);
    return item;
  }
  async update(id: string, patch: UpdateTicketPatch): Promise<Ticket | null> {
    const current = this.items.get(id);
    if (!current) return null;
    const updated: Ticket = {
      ...current,
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
      ...(patch.assignedToUserId !== undefined ? { assignedToUserId: patch.assignedToUserId } : {}),
      ...(patch.resolution !== undefined ? { resolution: patch.resolution } : {}),
      ...(patch.resolvedAt !== undefined ? { resolvedAt: patch.resolvedAt } : {}),
      updatedAt: new Date().toISOString(),
    };
    this.items.set(id, updated);
    return updated;
  }
  async addActivity(ticketId: string, authorUserId: string, type: TicketActivityType, description: string): Promise<TicketActivity> {
    const item: TicketActivity = { id: `activity-${this.activities.length + 1}`, ticketId, authorUserId, type, description, createdAt: new Date().toISOString() };
    this.activities.push(item);
    return item;
  }
  async listActivities(ticketId: string) { return this.activities.filter((item) => item.ticketId === ticketId); }
  async listAuditEvents(ticketId: string) { return this.audits.filter((item) => item.metadata.ticketId === ticketId); }
}

function validInput(overrides: Partial<CreateTicketInput> = {}): CreateTicketInput {
  return { customerId: customer.id, title: 'Sem conexão no cliente', description: 'Cliente informa perda total de conectividade.', category: 'NO_CONNECTION', priority: 'HIGH', ...overrides };
}

test('ticket service executes creation, diagnosis and resolution flow', async () => {
  const repository = new MemoryTicketsRepository();
  const service = new TicketsService(repository, customers);
  const created = await service.create(agent, validInput());
  assert.equal(created.status, 'OPEN');
  assert.equal(created.assignedToUserId, agent.id);

  const diagnosing = await service.changeStatus(agent, created.id, 'DIAGNOSING');
  assert.equal(diagnosing.status, 'DIAGNOSING');

  const testActivity = await service.addActivity(agent, created.id, 'TEST', 'Teste via cabo executado com perda de conectividade.');
  assert.equal(testActivity.type, 'TEST');
  await service.addActivity(agent, created.id, 'DIAGNOSIS', 'Possível falha no enlace óptico.');

  const resolved = await service.resolve(agent, created.id, 'Fibra reconectada e conexão normalizada.');
  assert.equal(resolved.status, 'RESOLVED');
  assert.equal(resolved.resolution, 'Fibra reconectada e conexão normalizada.');
});

test('ticket service blocks invalid transitions and requires supervisor to reopen', async () => {
  const repository = new MemoryTicketsRepository();
  const service = new TicketsService(repository, customers);
  const created = await service.create(agent, validInput());
  await assert.rejects(service.resolve(agent, created.id, 'Texto de resolução válido para o teste.'), (error: unknown) => error instanceof HttpException && error.getStatus() === 400);
  await service.changeStatus(agent, created.id, 'DIAGNOSING');
  await service.resolve(agent, created.id, 'Texto de resolução válido para o teste.');
  await assert.rejects(service.changeStatus(agent, created.id, 'DIAGNOSING'), (error: unknown) => error instanceof HttpException && error.getStatus() === 403);
  assert.equal((await service.changeStatus(supervisor, created.id, 'DIAGNOSING')).status, 'DIAGNOSING');
});

test('ticket service validates fields and filters', async () => {
  const repository = new MemoryTicketsRepository();
  const service = new TicketsService(repository, customers);
  await assert.rejects(service.create(agent, validInput({ title: 'x' })), (error: unknown) => error instanceof HttpException && error.getStatus() === 400);
  const created = await service.create(agent, validInput({ priority: 'CRITICAL' }));
  const page = await service.list(created.protocol, 'OPEN', 'CRITICAL', '1', '20');
  assert.equal(page.total, 1);
});
