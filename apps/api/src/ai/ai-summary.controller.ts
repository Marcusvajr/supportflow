import { Controller, Inject, Param, Post } from '@nestjs/common';
import { AiSummaryService } from './ai-summary.service';

@Controller('tickets')
export class AiSummaryController {
  constructor(@Inject(AiSummaryService) private readonly summaries: AiSummaryService) {}

  @Post(':id/ai-summary')
  summarize(@Param('id') id: string) {
    return this.summaries.summarize(id);
  }
}
