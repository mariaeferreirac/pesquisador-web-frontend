import type { ErroApi } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  status: number;

  constructor(erro: ErroApi, status: number) {
    super(erro.error);
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

// Comunicação stateless: cada chamada é independente, sem sessão mantida no
// servidor entre requisições.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    // FormData define seu próprio Content-Type (multipart, com boundary) — não sobrescrever.
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? (options.body as FormData) : options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const erro: ErroApi = payload?.error ? payload : { error: `Erro ${response.status}` };
    throw new ApiError(erro, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
