import type { ErroApi } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  codigo: string;
  status: number;

  constructor(erro: ErroApi, status: number) {
    super(erro.mensagem);
    this.codigo = erro.codigo;
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
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const erro: ErroApi =
      payload?.codigo && payload?.mensagem
        ? payload
        : { codigo: 'ERRO_DESCONHECIDO', mensagem: `Erro ${response.status}` };
    throw new ApiError(erro, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
