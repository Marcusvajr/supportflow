import './auth-fixtures';
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AUTH_CONFIG } from '../src/auth/auth.config';
import type { CreateCustomerInput, Customer, CustomerListQuery, CustomerPage, UpdateCustomerInput } from '../src/customers/customer';
import { CustomersRepository, DuplicateCustomerReferenceError } from '../src/customers/customers.repository';
import { AccessLogger } from '../src/common/access-logger';
import { InMemoryUsersRepository } from '../src/users/in-memory-users.repository';
import { UsersRepository } from '../src/users/users.repository';
import { authConfig, sessionToken, users } from './auth-fixtures';

class MemoryCustomersRepository extends CustomersRepository {
  private readonly items = new Map<string, Customer>();
  private sequence = 1;

  async list(query: CustomerListQuery): Promise<CustomerPage> {
    const all = [...this.items.values()].filter((item) => !query.q
      || item.name.toLowerCase().includes(query.q.toLowerCase())
      || item.referenceCode.toLowerCase().includes(query.q.toLowerCase()));
    const start = (query.page - 1) * query.pageSize;
    return { items: all.slice(start, start + query.pageSize), page: query.page, pageSize: query.pageSize, total: all.length };
  }

  async findById(id: string) { return this.items.get(id) ?? null; }

  async create(input: CreateCustomerInput): Promise<Customer> {
    if ([...this.items.values()].some((item) => item.referenceCode === input.referenceCode)) throw new DuplicateCustomerReferenceError();
    const now = new Date().toISOString();
    const customer: Customer = {
      id: `customer-${this.sequence++}`, referenceCode: input.referenceCode, name: input.name,
      documentMasked: input.documentMasked ?? null, phoneMasked: input.phoneMasked ?? null, city: input.city ?? null,
      createdAt: now, updatedAt: now,
    };
    this.items.set(customer.id, customer);
    return customer;
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer | null> {
    const current = this.items.get(id);
    if (!current) return null;
    const updated = { ...current, ...input, updatedAt: new Date().toISOString() };
    this.items.set(id, updated);
    return updated;
  }
}

let app: INestApplication;
let baseUrl: string;

before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(AUTH_CONFIG).useValue(authConfig)
    .overrideProvider(UsersRepository).useValue(new InMemoryUsersRepository(users))
    .overrideProvider(CustomersRepository).useValue(new MemoryCustomersRepository())
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

test('HTTP customer flow creates, lists, reads and updates a customer', async () => {
  const createdResponse = await request('/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referenceCode: 'demo-100', name: 'Cliente V3', city: 'Lagoa Santa' }),
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json() as Customer;
  assert.equal(created.referenceCode, 'DEMO-100');

  const listedResponse = await request('/customers?q=V3&page=1&pageSize=20');
  assert.equal(listedResponse.status, 200);
  const listed = await listedResponse.json() as CustomerPage;
  assert.equal(listed.total, 1);
  assert.equal(listed.items[0]?.id, created.id);

  const detailResponse = await request(`/customers/${created.id}`);
  assert.equal(detailResponse.status, 200);

  const updateResponse = await request(`/customers/${created.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Cliente V3 Atualizado' }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal(((await updateResponse.json()) as Customer).name, 'Cliente V3 Atualizado');
});

test('HTTP customers stays protected and validates request data', async () => {
  const unauthorized = await fetch(`${baseUrl}/customers`);
  assert.equal(unauthorized.status, 401);

  const invalid = await request('/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referenceCode: '!', name: 'A' }),
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).type, 'validation_error');
});
