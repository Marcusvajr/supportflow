import { Inject, Injectable, type NestMiddleware } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { AccessLogger } from './access-logger';

export type ContextRequest = Request & {
  requestId?: string;
  traceId?: string;
};

function safeRequestId(value: string | undefined): string {
  if (value && /^[A-Za-z0-9._:-]{8,128}$/.test(value)) return value;
  return randomUUID();
}

function traceContext(value: string | undefined): { header: string; traceId: string } {
  if (value && /^00-[0-9a-f]{32}-[0-9a-f]{16}-0[01]$/.test(value)) {
    return { header: value, traceId: value.split('-')[1] };
  }
  const traceId = randomBytes(16).toString('hex');
  const spanId = randomBytes(8).toString('hex');
  return { header: `00-${traceId}-${spanId}-01`, traceId };
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(@Inject(AccessLogger) private readonly logger: AccessLogger) {}

  use(request: ContextRequest, response: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint();
    const requestId = safeRequestId(request.header('x-request-id') ?? undefined);
    const trace = traceContext(request.header('traceparent') ?? undefined);
    request.requestId = requestId;
    request.traceId = trace.traceId;
    response.setHeader('X-Request-Id', requestId);
    response.setHeader('traceparent', trace.header);

    response.once('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      this.logger.write({
        request_id: requestId,
        trace_id: trace.traceId,
        route: request.path,
        method: request.method,
        status: response.statusCode,
        duration_ms: Math.round(durationMs * 100) / 100,
      });
    });

    next();
  }
}
