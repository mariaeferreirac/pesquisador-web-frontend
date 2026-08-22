import { apiRequest } from './client';
import type { Categoria } from '../types/api';

// Essas rotas ainda não existem no backend, essa é apenas a estrutura já usada em src/routes/ do exercicios-app-backend
export function listarCategorias(): Promise<Categoria[]> {
  return apiRequest<Categoria[]>('/categorias');
}

export function criarCategoria(nome: string): Promise<Categoria> {
  return apiRequest<Categoria>('/categorias', { method: 'POST', body: { nome } });
}
