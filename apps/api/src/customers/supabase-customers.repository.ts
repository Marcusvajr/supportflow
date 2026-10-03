import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { CreateCustomerInput, Customer, CustomerListQuery, CustomerPage, UpdateCustomerInput } from './customer';
import { CustomersRepository, DuplicateCustomerReferenceError } from './customers.repository';

type CustomerRecord = {
  id: string;
  reference_code: string;
  name: string;
  document_masked: string | null;
  phone_masked: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class SupabaseCustomersRepository extends CustomersRepository {
  private config(): { url: string; key: string } {
    const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
    if (!url || !key) {
      throw new ServiceUnavailableException('Persistência de clientes temporariamente indisponível.');
    }
    return { url, key };
  }

  private headers(extra: Record<string, string> = {}): Headers {
    const { key } = this.config();
    return new Headers({
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      ...extra,
    });
  }

  private async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const { url } = this.config();
    try {
      return await fetch(`${url}/rest/v1/${path}`, {
        ...init,
        headers: this.mergeHeaders(init.headers),
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new ServiceUnavailableException('Persistência de clientes temporariamente indisponível.');
    }
  }

  private mergeHeaders(input?: HeadersInit): Headers {
    const headers = this.headers();
    if (input) new Headers(input).forEach((value, key) => headers.set(key, value));
    return headers;
  }

  private map(record: CustomerRecord): Customer {
    return {
      id: record.id,
      referenceCode: record.reference_code,
      name: record.name,
      documentMasked: record.document_masked,
      phoneMasked: record.phone_masked,
      city: record.city,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  private async parseRecords(response: Response): Promise<CustomerRecord[]> {
    if (!response.ok) throw new ServiceUnavailableException('Persistência de clientes temporariamente indisponível.');
    return await response.json() as CustomerRecord[];
  }

  async list(query: CustomerListQuery): Promise<CustomerPage> {
    const params = new URLSearchParams({
      select: 'id,reference_code,name,document_masked,phone_masked,city,created_at,updated_at',
      order: 'created_at.desc',
      limit: String(query.pageSize),
      offset: String((query.page - 1) * query.pageSize),
    });
    if (query.q) {
      const term = query.q.replace(/[,%()]/g, '').slice(0, 80);
      params.set('or', `(name.ilike.*${term}*,reference_code.ilike.*${term}*)`);
    }
    const response = await this.fetch(`customers?${params.toString()}`, {
      headers: { Prefer: 'count=exact' },
    });
    const items = (await this.parseRecords(response)).map((record) => this.map(record));
    const range = response.headers.get('content-range');
    const total = range?.includes('/') ? Number(range.split('/')[1]) : items.length;
    return { items, page: query.page, pageSize: query.pageSize, total: Number.isFinite(total) ? total : items.length };
  }

  async findById(id: string): Promise<Customer | null> {
    const params = new URLSearchParams({
      select: 'id,reference_code,name,document_masked,phone_masked,city,created_at,updated_at',
      id: `eq.${id}`,
      limit: '1',
    });
    const records = await this.parseRecords(await this.fetch(`customers?${params.toString()}`));
    return records[0] ? this.map(records[0]) : null;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    const response = await this.fetch('customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({
        reference_code: input.referenceCode,
        name: input.name,
        document_masked: input.documentMasked ?? null,
        phone_masked: input.phoneMasked ?? null,
        city: input.city ?? null,
      }),
    });
    if (response.status === 409) throw new DuplicateCustomerReferenceError();
    const records = await this.parseRecords(response);
    if (!records[0]) throw new ServiceUnavailableException('Persistência de clientes temporariamente indisponível.');
    return this.map(records[0]);
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer | null> {
    const body: Record<string, string | null> = {};
    if (input.referenceCode !== undefined) body.reference_code = input.referenceCode;
    if (input.name !== undefined) body.name = input.name;
    if (input.documentMasked !== undefined) body.document_masked = input.documentMasked ?? null;
    if (input.phoneMasked !== undefined) body.phone_masked = input.phoneMasked ?? null;
    if (input.city !== undefined) body.city = input.city ?? null;

    const params = new URLSearchParams({ id: `eq.${id}` });
    const response = await this.fetch(`customers?${params.toString()}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(body),
    });
    if (response.status === 409) throw new DuplicateCustomerReferenceError();
    const records = await this.parseRecords(response);
    return records[0] ? this.map(records[0]) : null;
  }
}
