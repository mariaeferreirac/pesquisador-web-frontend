import { apiRequest } from './client';
import type { Categoria } from '../types/api';

export function listarCategorias(busca?: string): Promise<Categoria[]> {
  const query = busca && busca.trim() ? `?busca=${encodeURIComponent(busca.trim())}` : '';
  return apiRequest<Categoria[]>(`/categorias${query}`);
}

export function criarCategoria(nome: string): Promise<Categoria> {
  return apiRequest<Categoria>('/categorias', { method: 'POST', body: { nome } });
}

export function atualizarCategoria(id: number, nome: string): Promise<Categoria> {
  return apiRequest<Categoria>(`/categorias/${id}`, { method: 'PUT', body: { nome } });
}

export function removerCategoria(id: number): Promise<void> {
  return apiRequest<void>(`/categorias/${id}`, { method: 'DELETE' });
}
