import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function readCorsConfig(env: NodeJS.ProcessEnv = process.env): CorsOptions {
  const configured = env.FRONTEND_ORIGIN ?? (env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
  const origins = [...new Set(configured.split(',').map((origin) => origin.trim()).filter(Boolean))];

  for (const origin of origins) {
    let url: URL;
    try { url = new URL(origin); } catch { throw new Error('FRONTEND_ORIGIN must contain exact HTTP(S) origins.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
      throw new Error('FRONTEND_ORIGIN must contain exact HTTP(S) origins.');
    }
  }

  return { origin: origins, credentials: true, exposedHeaders: ['X-Request-Id', 'traceparent'] };
}
