import type { AuditEvent, CreateTicketInput, DashboardSummary, Ticket, TicketActivity, TicketActivityType, TicketCategory, TicketPage, TicketPriority, TicketStatus } from './ticket';

export type TicketListQuery = {
  q?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedToUserId?: string;
  page: number;
  pageSize: number;
  sortBy: 'updatedAt' | 'createdAt';
  sortDirection: 'asc' | 'desc';
};

export type PersistTicketInput = CreateTicketInput & {
  assignedToUserId: string | null;
  createdByUserId: string;
};

export type UpdateTicketPatch = {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToUserId?: string | null;
  resolution?: string | null;
  resolvedAt?: string | null;
  lastModifiedByUserId: string;
};

export abstract class TicketsRepository {
  abstract list(query: TicketListQuery): Promise<TicketPage>;
  abstract summary(): Promise<DashboardSummary>;
  abstract findById(id: string): Promise<Ticket | null>;
  abstract create(input: PersistTicketInput): Promise<Ticket>;
  abstract update(id: string, patch: UpdateTicketPatch): Promise<Ticket | null>;
  abstract addActivity(ticketId: string, authorUserId: string, type: TicketActivityType, description: string): Promise<TicketActivity>;
  abstract listActivities(ticketId: string): Promise<TicketActivity[]>;
  abstract listAuditEvents(ticketId: string): Promise<AuditEvent[]>;
}
