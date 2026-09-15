import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

export type HealthResponse = {
  status: 'ok';
  service: 'supportflow-api';
};

@Controller('health')
@Public()
export class HealthController {
  @Get()
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'supportflow-api',
    };
  }
}
