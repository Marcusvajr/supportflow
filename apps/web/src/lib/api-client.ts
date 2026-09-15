export type CurrentUser = { id: string; name: string; email: string; role: 'AGENT' | 'SUPERVISOR' };

export class ApiError extends Error {
  constructor(readonly status: number) {
    super('Não foi possível concluir a solicitação.');
    this.name = 'ApiError';
  }
}

type ClientOptions = {
  baseUrl: string;
  getToken: () => Promise<string | null>;
  onUnauthorized: () => void | Promise<void>;
  onForbidden: () => void | Promise<void>;
  fetch?: typeof fetch;
};

export function createApiClient(options: ClientOptions) {
  const fetcher = options.fetch ?? fetch;
  return {
    async request<T>(path: string, init: RequestInit = {}): Promise<T> {
      if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
        throw new Error('O caminho deve ser relativo à API.');
      }
      const token = await options.getToken();
      if (!token) {
        await options.onUnauthorized();
        throw new ApiError(401);
      }
      const headers = new Headers(init.headers);
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      const response = await fetcher(`${options.baseUrl.replace(/\/$/, '')}${path}`, {
        ...init, headers, cache: 'no-store', credentials: 'omit', redirect: 'error',
      });
      if (response.status === 401) await options.onUnauthorized();
      if (response.status === 403) await options.onForbidden();
      if (!response.ok) throw new ApiError(response.status);
      return await response.json() as T;
    },
  };
}
