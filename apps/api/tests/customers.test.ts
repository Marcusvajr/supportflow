import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HttpException } from '@nestjs/common';
import type { CreateCustomerInput, Customer, CustomerListQuery, CustomerPage, UpdateCustomerInput } from '../src/customers/customer';
import { CustomersRepository, DuplicateCustomerReferenceError } from '../src/customers/customers.repository';
import { CustomersService } from '../src/customers/customers.service';

class MemoryCustomersRepository extends CustomersRepository {
  private readonly items = new Map<string, Customer>();
  private sequence = 1;

  async list(query: CustomerListQuery): Promise<CustomerPage> {
    const all = [...this.items.values()].filter((item) => {
      const q = query.q?.toLowerCase();
      return !q || item.name.toLowerCase().includes(q) || item.referenceCode.toLowerCase().includes(q);
    });
    const start = (query.page - 1) * query.pageSize;
    return { items: all.slice(start, start + query.pageSize), page: query.page, pageSize: query.pageSize, total: all.length };
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    if ([...this.items.values()].some((item) => item.referenceCode === input.referenceCode)) {
      throw new DuplicateCustomerReferenceError();
    }
    const now = new Date().toISOString();
    const customer: Customer = {
      id: `customer-${this.sequence++}`,
      referenceCode: input.referenceCode,
      name: input.name,
      documentMasked: input.documentMasked ?? null,
      phoneMasked: input.phoneMasked ?? null,
      city: input.city ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(customer.id, customer);
    return customer;
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer | null> {
    const current = this.items.get(id);
    if (!current) return null;
    if (input.referenceCode && [...this.items.values()].some((item) => item.id !== id && item.referenceCode === input.referenceCode)) {
      throw new DuplicateCustomerReferenceError();
    }
    const updated = { ...current, ...input, updatedAt: new Date().toISOString() };
    this.items.set(id, updated);
    return updated;
  }
}

test('customers service normalizes and persists fictitious customer data', async () => {
  const service = new CustomersService(new MemoryCustomersRepository());
  const customer = await service.create({
    referenceCode: ' demo-001 ',
    name: ' Cliente Demonstração ',
    documentMasked: ' ***.***.***-01 ',
    city: ' Lagoa Santa ',
  });
  assert.equal(customer.referenceCode, 'DEMO-001');
  assert.equal(customer.name, 'Cliente Demonstração');
  assert.equal(customer.city, 'Lagoa Santa');
  assert.equal((await service.list('demo', '1', '20')).total, 1);
});

test('customers service rejects invalid input and duplicate reference code', async () => {
  const service = new CustomersService(new MemoryCustomersRepository());
  await assert.rejects(service.create({ referenceCode: '!', name: 'A' }), (error: unknown) => error instanceof HttpException && error.getStatus() === 400);
  await service.create({ referenceCode: 'DEMO-001', name: 'Cliente Um' });
  await assert.rejects(service.create({ referenceCode: 'demo-001', name: 'Cliente Dois' }), (error: unknown) => error instanceof HttpException && error.getStatus() === 409);
});

test('customers service updates existing records and returns 404 for missing ids', async () => {
  const service = new CustomersService(new MemoryCustomersRepository());
  const customer = await service.create({ referenceCode: 'DEMO-001', name: 'Cliente Um' });
  const updated = await service.update(customer.id, { name: 'Cliente Atualizado', city: '' });
  assert.equal(updated.name, 'Cliente Atualizado');
  assert.equal(updated.city, null);
  await assert.rejects(service.get('missing'), (error: unknown) => error instanceof HttpException && error.getStatus() === 404);
});
