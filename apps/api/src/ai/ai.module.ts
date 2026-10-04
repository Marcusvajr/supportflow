import { Module } from '@nestjs/common';
import { TicketsModule } from '../tickets/tickets.module';
import { AiSummaryController } from './ai-summary.controller';
import { AiSummaryProvider, OpenAiCompatibleSummaryProvider } from './ai-summary.provider';
import { AiSummaryService } from './ai-summary.service';

@Module({
  imports: [TicketsModule],
  controllers: [AiSummaryController],
  providers: [
    { provide: AiSummaryProvider, useClass: OpenAiCompatibleSummaryProvider },
    AiSummaryService,
  ],
  exports: [AiSummaryService],
})
export class AiModule {}
