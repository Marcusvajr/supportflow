import { Inject, Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';
import { AiSummaryProvider } from './ai-summary.provider';

export type AiTicketSummary = {
  summary: string;
  disclaimer: string;
  generatedAt: string;
  provider: string;
};

@Injectable()
export class AiSummaryService {
  constructor(
    @Inject(TicketsService) private readonly tickets: TicketsService,
    @Inject(AiSummaryProvider) private readonly provider: AiSummaryProvider,
  ) {}

  async summarize(ticketId: string): Promise<AiTicketSummary> {
    const [ticket, timeline] = await Promise.all([
      this.tickets.get(ticketId),
      this.tickets.timeline(ticketId),
    ]);

    const safeContext = {
      protocol: ticket.protocol,
      customer: {
        referenceCode: ticket.customerReferenceCode,
        name: ticket.customerName,
      },
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      status: ticket.status,
      priority: ticket.priority,
      resolution: ticket.resolution,
      timeline: timeline.slice(-30).map((item) => item.kind === 'activity'
        ? {
            kind: item.kind,
            type: item.type,
            description: item.description,
            createdAt: item.createdAt,
          }
        : {
            kind: item.kind,
            action: item.action,
            metadata: item.metadata,
            createdAt: item.createdAt,
          }),
    };

    const result = await this.provider.generate(
      `Resuma este chamado técnico fictício sem acrescentar informações:\n${JSON.stringify(safeContext)}`,
    );

    return {
      summary: result.text,
      disclaimer: 'Resumo assistivo gerado por IA. Revise o histórico original antes de tomar decisões.',
      generatedAt: new Date().toISOString(),
      provider: result.provider,
    };
  }
}
