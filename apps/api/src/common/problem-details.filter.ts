import { Catch, HttpException, Inject, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import { AccessLogger } from './access-logger';

const errors: Record<number, [string, string]> = {
  400: ['validation_error', 'Dados inválidos'],
  401: ['authentication_error', 'Não autenticado'],
  403: ['authorization_error', 'Acesso negado'],
  404: ['not_found', 'Recurso não encontrado'],
  503: ['service_unavailable', 'Serviço indisponível'],
};

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  constructor(@Inject(AccessLogger) private readonly logger: AccessLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const [type, title] = errors[status] ?? ['internal_error', 'Erro interno'];
    const instance = request.path; // Excluir query string, inclusive tokens enviados incorretamente na URL.
    const requestId = randomUUID();
    this.logger.write({ request_id: requestId, route: request.route?.path ?? 'unmatched', method: request.method, status });
    response.setHeader('X-Request-Id', requestId);
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/problem+json');
    if (status === 401) response.setHeader('WWW-Authenticate', 'Bearer');
    response.status(status).json({
      type, title, status,
      detail: status < 500 && exception instanceof HttpException ? exception.message : 'Não foi possível concluir a solicitação.',
      instance,
    });
  }
}
