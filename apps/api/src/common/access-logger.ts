import { Injectable } from '@nestjs/common';

export type AccessFailure = {
  request_id: string;
  route: string;
  method: string;
  status: number;
};

@Injectable()
export class AccessLogger {
  write(event: AccessFailure): void {
    // Whitelist de campos: nunca registrar headers, cookies, claims ou erros do SDK.
    process.stdout.write(`${JSON.stringify({
      timestamp: new Date().toISOString(), level: event.status >= 500 ? 'error' : 'warn',
      service: 'supportflow-api', event: 'request_rejected',
      request_id: event.request_id, route: event.route, method: event.method, status: event.status,
    })}\n`);
  }
}
