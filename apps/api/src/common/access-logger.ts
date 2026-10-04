import { Injectable } from '@nestjs/common';

export type AccessEvent = {
  request_id: string;
  trace_id?: string;
  route: string;
  method: string;
  status: number;
  duration_ms?: number;
};

export type AccessFailure = AccessEvent;

@Injectable()
export class AccessLogger {
  write(event: AccessEvent): void {
    const failed = event.status >= 400;
    process.stdout.write(`${JSON.stringify({
      timestamp: new Date().toISOString(),
      level: event.status >= 500 ? 'error' : failed ? 'warn' : 'info',
      service: 'supportflow-api',
      event: failed ? 'http_request_failed' : 'http_request_completed',
      request_id: event.request_id,
      trace_id: event.trace_id,
      route: event.route,
      method: event.method,
      status: event.status,
      duration_ms: event.duration_ms,
    })}\n`);
  }
}
