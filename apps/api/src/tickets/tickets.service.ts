import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import type { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { activityTypes, ticketCategories, ticketPriorities, ticketStatuses, type CreateTicketInput, type DashboardSummary, type Ticket, type TicketActivityType, type TicketCategory, type TicketPage, type TicketPriority, type TicketStatus, type TimelineItem } from './ticket';
import { TicketsRepository } from './tickets.repository';

const transitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['DIAGNOSING', 'ESCALATED'],
  DIAGNOSING: ['ESCALATED', 'RESOLVED'],
  ESCALATED: ['DIAGNOSING', 'RESOLVED'],
  RESOLVED: ['DIAGNOSING'],
};

@Injectable()
export class TicketsService {
  constructor(
    @Inject(TicketsRepository) private readonly repository: TicketsRepository,
    @Inject(CustomersService) private readonly customers: CustomersService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}

  async list(
    q?: string,
    statusValue?: string,
    priorityValue?: string,
    categoryValue?: string,
    assignedToUserId?: string,
    pageValue?: string,
    pageSizeValue?: string,
    sortByValue?: string,
    sortDirectionValue?: string,
  ): Promise<TicketPage> {
    const status = statusValue ? this.enumValue(statusValue, ticketStatuses, 'status') : undefined;
    const priority = priorityValue ? this.enumValue(priorityValue, ticketPriorities, 'prioridade') : undefined;
    const category = categoryValue ? this.enumValue(categoryValue, ticketCategories, 'categoria') as TicketCategory : undefined;
    const page = this.positiveInteger(pageValue, 1, 100000);
    const pageSize = this.positiveInteger(pageSizeValue, 20, 100);
    const sortBy = sortByValue === undefined ? 'updatedAt' : this.enumValue(sortByValue, ['updatedAt', 'createdAt'] as const, 'ordenação');
    const sortDirection = sortDirectionValue === undefined ? 'desc' : this.enumValue(sortDirectionValue, ['asc', 'desc'] as const, 'direção');
    return await this.repository.list({
      q: q?.trim().slice(0, 80) || undefined,
      status,
      priority,
      category,
      assignedToUserId: assignedToUserId?.trim() || undefined,
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
  }

  summary(): Promise<DashboardSummary> {
    return this.repository.summary();
  }

  async get(id: string): Promise<Ticket> {
    const ticket = await this.repository.findById(id);
    if (!ticket) throw new NotFoundException('Chamado não encontrado.');
    return ticket;
  }

  async create(user: User, input: CreateTicketInput): Promise<Ticket> {
    if (!input || typeof input !== 'object') throw new BadRequestException('Dados do chamado são obrigatórios.');
    await this.customers.get(this.requiredText(input.customerId, 'cliente', 1, 80));
    const normalized: CreateTicketInput = {
      customerId: input.customerId,
      title: this.requiredText(input.title, 'título', 5, 150),
      description: this.requiredText(input.description, 'descrição', 10, 5000),
      category: this.enumValue(input.category, ticketCategories, 'categoria'),
      priority: this.enumValue(input.priority, ticketPriorities, 'prioridade'),
    };
    return await this.repository.create({ ...normalized, assignedToUserId: user.id, createdByUserId: user.id });
  }

  async changeStatus(user: User, id: string, value: unknown): Promise<Ticket> {
    const ticket = await this.get(id);
    const next = this.enumValue(value, ticketStatuses, 'status');
    if (next === 'RESOLVED') throw new BadRequestException('Use a ação de resolução para concluir o chamado.');
    if (!transitions[ticket.status].includes(next)) throw new BadRequestException('Transição de status não permitida.');
    if (ticket.status === 'RESOLVED' && next === 'DIAGNOSING' && user.role !== 'SUPERVISOR') {
      throw new ForbiddenException('Somente supervisor pode reabrir um chamado resolvido.');
    }
    const updated = await this.repository.update(id, {
      status: next,
      resolution: ticket.status === 'RESOLVED' && next === 'DIAGNOSING' ? null : undefined,
      resolvedAt: ticket.status === 'RESOLVED' && next === 'DIAGNOSING' ? null : undefined,
      lastModifiedByUserId: user.id,
    });
    if (!updated) throw new NotFoundException('Chamado não encontrado.');
    return updated;
  }

  async changePriority(user: User, id: string, value: unknown): Promise<Ticket> {
    await this.get(id);
    const priority = this.enumValue(value, ticketPriorities, 'prioridade');
    const updated = await this.repository.update(id, { priority, lastModifiedByUserId: user.id });
    if (!updated) throw new NotFoundException('Chamado não encontrado.');
    return updated;
  }

  async assign(user: User, id: string, assignedToUserIdValue: unknown): Promise<Ticket> {
    if (user.role !== 'SUPERVISOR') {
      throw new ForbiddenException('Somente supervisor pode reatribuir chamados.');
    }
    const ticket = await this.get(id);
    if (ticket.status === 'RESOLVED') {
      throw new BadRequestException('Reabra o chamado antes de alterar o responsável.');
    }
    const assignedToUserId = this.requiredText(assignedToUserIdValue, 'responsável', 1, 128);
    const target = await this.users.findActiveById(assignedToUserId);
    const updated = await this.repository.update(id, { assignedToUserId: target.id, lastModifiedByUserId: user.id });
    if (!updated) throw new NotFoundException('Chamado não encontrado.');
    return updated;
  }

  async resolve(user: User, id: string, resolutionValue: unknown): Promise<Ticket> {
    const ticket = await this.get(id);
    if (!transitions[ticket.status].includes('RESOLVED')) throw new BadRequestException('Este chamado não pode ser resolvido a partir do status atual.');
    const resolution = this.requiredText(resolutionValue, 'resolução', 10, 5000);
    const updated = await this.repository.update(id, {
      status: 'RESOLVED', resolution, resolvedAt: new Date().toISOString(), lastModifiedByUserId: user.id,
    });
    if (!updated) throw new NotFoundException('Chamado não encontrado.');
    return updated;
  }

  async addActivity(user: User, id: string, typeValue: unknown, descriptionValue: unknown) {
    const ticket = await this.get(id);
    if (ticket.status === 'RESOLVED') throw new BadRequestException('Reabra o chamado para registrar nova atividade.');
    const type = this.enumValue(typeValue, activityTypes, 'tipo de atividade') as TicketActivityType;
    const description = this.requiredText(descriptionValue, 'descrição da atividade', 2, 5000);
    return await this.repository.addActivity(id, user.id, type, description);
  }

  async timeline(id: string): Promise<TimelineItem[]> {
    await this.get(id);
    const [activities, audits] = await Promise.all([this.repository.listActivities(id), this.repository.listAuditEvents(id)]);
    return [
      ...activities.map((item): TimelineItem => ({ id: item.id, kind: 'activity', type: item.type, actorUserId: item.authorUserId, description: item.description, createdAt: item.createdAt })),
      ...audits.map((item): TimelineItem => ({ id: item.id, kind: 'audit', action: item.action, actorUserId: item.actorUserId, metadata: item.metadata, createdAt: item.createdAt })),
    ].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  private requiredText(value: unknown, field: string, min: number, max: number): string {
    if (typeof value !== 'string') throw new BadRequestException(`O campo ${field} é obrigatório.`);
    const text = value.trim();
    if (text.length < min || text.length > max) throw new BadRequestException(`O campo ${field} deve ter entre ${min} e ${max} caracteres.`);
    return text;
  }

  private enumValue<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
    if (typeof value !== 'string' || !allowed.includes(value as T[number])) throw new BadRequestException(`O campo ${field} é inválido.`);
    return value as T[number];
  }

  private positiveInteger(value: string | undefined, fallback: number, max: number): number {
    if (value === undefined) return fallback;
    if (!/^\d+$/.test(value)) throw new BadRequestException('Parâmetro de paginação inválido.');
    const parsed = Number(value);
    if (parsed < 1 || parsed > max) throw new BadRequestException('Parâmetro de paginação inválido.');
    return parsed;
  }
}
