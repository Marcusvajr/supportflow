import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { AuditEvent, Ticket, TicketActivity, TicketPage } from './ticket';
import type { PersistTicketInput, TicketListQuery, UpdateTicketPatch } from './tickets.repository';
import { TicketsRepository } from './tickets.repository';

type TicketRecord = {
  id: string; protocol: string; customer_id: string; title: string; description: string;
  category: Ticket['category']; status: Ticket['status']; priority: Ticket['priority'];
  assigned_to_user_id: string | null; created_by_user_id: string; resolution: string | null;
  created_at: string; updated_at: string; resolved_at: string | null;
  customer: { name: string; reference_code: string } | null;
};

type ActivityRecord = {
  id: string; ticket_id: string; author_user_id: string; type: TicketActivity['type']; description: string; created_at: string;
};

type AuditRecord = {
  id: string; action: string; actor_user_id: string; metadata: Record<string, unknown>; created_at: string;
};

@Injectable()
export class SupabaseTicketsRepository extends TicketsRepository {
  private config(): { url: string; publishableKey: string; backendKey: string } {
    const url = (process.env.SUPABASE_URL ?? '').replace(/\/$/, '');
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? '';
    const backendKey = process.env.SUPABASE_BACKEND_KEY ?? '';
    if (!url || !publishableKey || !backendKey) {
      throw new ServiceUnavailableException('Persistência de chamados temporariamente indisponível.');
    }
    return { url, publishableKey, backendKey };
  }

  private headers(extra: Record<string, string> = {}): Headers {
    const { publishableKey, backendKey } = this.config();
    return new Headers({ apikey: publishableKey, 'x-app-api-key': backendKey, Accept: 'application/json', ...extra });
  }

  private async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const { url } = this.config();
    const headers = this.headers();
    if (init.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    try {
      return await fetch(`${url}/rest/v1/${path}`, { ...init, headers, signal: AbortSignal.timeout(10000) });
    } catch {
      throw new ServiceUnavailableException('Persistência de chamados temporariamente indisponível.');
    }
  }

  private async records<T>(response: Response): Promise<T[]> {
    if (!response.ok) throw new ServiceUnavailableException('Persistência de chamados temporariamente indisponível.');
    return await response.json() as T[];
  }

  private map(record: TicketRecord): Ticket {
    return {
      id: record.id, protocol: record.protocol, customerId: record.customer_id,
      customerName: record.customer?.name ?? 'Cliente', customerReferenceCode: record.customer?.reference_code ?? '',
      title: record.title, description: record.description, category: record.category, status: record.status,
      priority: record.priority, assignedToUserId: record.assigned_to_user_id, createdByUserId: record.created_by_user_id,
      resolution: record.resolution, createdAt: record.created_at, updatedAt: record.updated_at, resolvedAt: record.resolved_at,
    };
  }

  private select() {
    return 'id,protocol,customer_id,title,description,category,status,priority,assigned_to_user_id,created_by_user_id,resolution,created_at,updated_at,resolved_at,customer:customers(name,reference_code)';
  }

  async list(query: TicketListQuery): Promise<TicketPage> {
    const params = new URLSearchParams({
      select: this.select(), order: 'updated_at.desc', limit: String(query.pageSize), offset: String((query.page - 1) * query.pageSize),
    });
    if (query.q) {
      const term = query.q.replace(/[,%()]/g, '').slice(0, 80);
      params.set('or', `(protocol.ilike.*${term}*,title.ilike.*${term}*)`);
    }
    if (query.status) params.set('status', `eq.${query.status}`);
    if (query.priority) params.set('priority', `eq.${query.priority}`);
    const response = await this.fetch(`tickets?${params.toString()}`, { headers: { Prefer: 'count=exact' } });
    const items = (await this.records<TicketRecord>(response)).map((record) => this.map(record));
    const range = response.headers.get('content-range');
    const total = range?.includes('/') ? Number(range.split('/')[1]) : items.length;
    return { items, page: query.page, pageSize: query.pageSize, total: Number.isFinite(total) ? total : items.length };
  }

  async findById(id: string): Promise<Ticket | null> {
    const params = new URLSearchParams({ select: this.select(), id: `eq.${id}`, limit: '1' });
    const records = await this.records<TicketRecord>(await this.fetch(`tickets?${params.toString()}`));
    return records[0] ? this.map(records[0]) : null;
  }

  async create(input: PersistTicketInput): Promise<Ticket> {
    const response = await this.fetch('tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({
        protocol: '',
        customer_id: input.customerId,
        title: input.title,
        description: input.description,
        category: input.category,
        status: 'OPEN',
        priority: input.priority,
        assigned_to_user_id: input.assignedToUserId,
        created_by_user_id: input.createdByUserId,
        last_modified_by_user_id: input.createdByUserId,
      }),
    });
    const raw = await this.records<Omit<TicketRecord, 'customer'> & { customer?: null }>(response);
    if (!raw[0]) throw new ServiceUnavailableException('Persistência de chamados temporariamente indisponível.');
    const ticket = await this.findById(raw[0].id);
    if (!ticket) throw new ServiceUnavailableException('Persistência de chamados temporariamente indisponível.');
    return ticket;
  }

  async update(id: string, patch: UpdateTicketPatch): Promise<Ticket | null> {
    const body: Record<string, string | null> = { last_modified_by_user_id: patch.lastModifiedByUserId };
    if (patch.status !== undefined) body.status = patch.status;
    if (patch.priority !== undefined) body.priority = patch.priority;
    if (patch.assignedToUserId !== undefined) body.assigned_to_user_id = patch.assignedToUserId;
    if (patch.resolution !== undefined) body.resolution = patch.resolution;
    if (patch.resolvedAt !== undefined) body.resolved_at = patch.resolvedAt;
    const response = await this.fetch(`tickets?${new URLSearchParams({ id: `eq.${id}` }).toString()}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify(body),
    });
    const raw = await this.records<TicketRecord>(response);
    if (!raw[0]) return null;
    return await this.findById(id);
  }

  async addActivity(ticketId: string, authorUserId: string, type: TicketActivity['type'], description: string): Promise<TicketActivity> {
    const response = await this.fetch('ticket_activities', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ ticket_id: ticketId, author_user_id: authorUserId, type, description }),
    });
    const records = await this.records<ActivityRecord>(response);
    if (!records[0]) throw new ServiceUnavailableException('Persistência de chamados temporariamente indisponível.');
    return this.mapActivity(records[0]);
  }

  async listActivities(ticketId: string): Promise<TicketActivity[]> {
    const params = new URLSearchParams({ ticket_id: `eq.${ticketId}`, order: 'created_at.asc' });
    return (await this.records<ActivityRecord>(await this.fetch(`ticket_activities?${params.toString()}`))).map((record) => this.mapActivity(record));
  }

  async listAuditEvents(ticketId: string): Promise<AuditEvent[]> {
    const params = new URLSearchParams({ entity_type: 'eq.TICKET', entity_id: `eq.${ticketId}`, order: 'created_at.asc' });
    return (await this.records<AuditRecord>(await this.fetch(`audit_events?${params.toString()}`))).map((record) => ({
      id: record.id, action: record.action, actorUserId: record.actor_user_id, metadata: record.metadata ?? {}, createdAt: record.created_at,
    }));
  }

  private mapActivity(record: ActivityRecord): TicketActivity {
    return { id: record.id, ticketId: record.ticket_id, authorUserId: record.author_user_id, type: record.type, description: record.description, createdAt: record.created_at };
  }
}
