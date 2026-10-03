import './auth-fixtures';
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AUTH_CONFIG } from '../src/auth/auth.config';
import type { CreateCustomerInput, Customer, CustomerListQuery, CustomerPage, UpdateCustomerInput } from '../src/customers/customer';
import { CustomersRepository } from '../src/customers/customers.repository';
import { AccessLogger } from '../src/common/access-logger';
import type { AuditEvent, Ticket, TicketActivity, TicketActivityType, TicketPage } from '../src/tickets/ticket';
import type { PersistTicketInput, TicketListQuery, UpdateTicketPatch } from '../src/tickets/tickets.repository';
import { TicketsRepository } from '../src/tickets/tickets.repository';
import { InMemoryUsersRepository } from '../src/users/in-memory-users.repository';
import { UsersRepository } from '../src/users/users.repository';
import { authConfig, sessionToken, users } from './auth-fixtures';

const customer: Customer = {
  id: '11111111-1111-4111-8111-111111111111', referenceCode: 'DEMO-001', name: 'Cliente Demo',
  documentMasked: null, phoneMasked: null, city: 'Lagoa Santa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

class MemoryCustomersRepository extends CustomersRepository {
  async list(query: CustomerListQuery): Promise<CustomerPage> { return { items: [customer], page: query.page, pageSize: query.pageSize, total: 1 }; }
  async findById(id: string) { return id === customer.id ? customer : null; }
  async create(_input: CreateCustomerInput) { return customer; }
  async update(_id: string, _input: UpdateCustomerInput) { return customer; }
}

class MemoryTicketsRepository extends TicketsRepository {
  item: Ticket | null = null;
  activities: TicketActivity[] = [];
  audits: AuditEvent[] = [];
  async list(query: TicketListQuery): Promise<TicketPage> { return { items: this.item ? [this.item] : [], page: query.page, pageSize: query.pageSize, total: this.item ? 1 : 0 }; }
  async findById(id: string) { return this.item?.id === id ? this.item : null; }
  async create(input: PersistTicketInput): Promise<Ticket> {
    const now = new Date().toISOString();
    this.item = {
      id: '22222222-2222-4222-8222-222222222222', protocol: 'SF-2026-000001', customerId: customer.id,
      customerName: customer.name, customerReferenceCode: customer.referenceCode, title: input.title, description: input.description,
      category: input.category, status: 'OPEN', priority: input.priority, assignedToUserId: input.assignedToUserId,
      createdByUserId: input.createdByUserId, resolution: null, createdAt: now, updatedAt: now, resolvedAt: null,
    };
    return this.item;
  }
  async update(id: string, patch: UpdateTicketPatch): Promise<Ticket | null> {
    if (!this.item || this.item.id !== id) return null;
    this.item = {
      ...this.item,
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
      ...(patch.resolution !== undefined ? { resolution: patch.resolution } : {}),
      ...(patch.resolvedAt !== undefined ? { resolvedAt: patch.resolvedAt } : {}),
      updatedAt: new Date().toISOString(),
    };
    return this.item;
  }
  async addActivity(ticketId: string, authorUserId: string, type: TicketActivityType, description: string): Promise<TicketActivity> {
    const item: TicketActivity = { id: 'activity-1', ticketId, authorUserId, type, description, createdAt: new Date().toISOString() };
    this.activities.push(item);
    return item;
  }
  async listActivities(ticketId: string) { return this.activities.filter((item) => item.ticketId === ticketId); }
  async listAuditEvents(_ticketId: string) { return this.audits; }
}

let app: INestApplication;
let baseUrl: string;
before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(AUTH_CONFIG).useValue(authConfig)
    .overrideProvider(UsersRepository).useValue(new InMemoryUsersRepository(users))
    .overrideProvider(CustomersRepository).useValue(new MemoryCustomersRepository())
    .overrideProvider(TicketsRepository).useValue(new MemoryTicketsRepository())
    .overrideProvider(AccessLogger).useValue({ write: () => undefined })
    .compile();
  app = module.createNestApplication({ logger: false });
  app.setGlobalPrefix('api/v1');
  await app.listen(0, '127.0.0.1');
  baseUrl = `${await app.getUrl()}/api/v1`;
});
after(async () => { await app?.close(); });

function request(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${sessionToken()}`);
  return fetch(`${baseUrl}${path}`, { ...init, headers });
}

test('HTTP complete ticket flow reaches resolution and keeps technical activity', async () => {
  const createdResponse = await request('/tickets', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId: customer.id, title: 'Sem conexão no cliente', description: 'Cliente informa perda total de conectividade.', category: 'NO_CONNECTION', priority: 'HIGH' }),
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json() as Ticket;

  assert.equal((await request(`/tickets/${created.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'DIAGNOSING' }) })).status, 200);
  assert.equal((await request(`/tickets/${created.id}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'TEST', description: 'Teste via cabo executado.' }) })).status, 201);
  assert.equal((await request(`/tickets/${created.id}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'DIAGNOSIS', description: 'Falha de enlace identificada.' }) })).status, 201);

  const resolvedResponse = await request(`/tickets/${created.id}/resolve`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resolution: 'Enlace restabelecido e conexão validada.' }),
  });
  assert.equal(resolvedResponse.status, 201);
  assert.equal(((await resolvedResponse.json()) as Ticket).status, 'RESOLVED');

  const timelineResponse = await request(`/tickets/${created.id}/timeline`);
  assert.equal(timelineResponse.status, 200);
  const timeline = await timelineResponse.json() as unknown[];
  assert.equal(timeline.length, 2);
});

test('HTTP ticket endpoints reject invalid business input', async () => {
  const invalid = await request('/tickets', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId: customer.id, title: 'x', description: 'curta', category: 'INVALID', priority: 'HIGH' }),
  });
  assert.equal(invalid.status, 400);
});
