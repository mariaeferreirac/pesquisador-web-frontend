import { apiRequest } from './client';
import type { TreinoAtualizarRequest, TreinoCriarRequest, TreinoDetalhe, TreinoResumo } from '../types/api';

export interface FiltrosTreinos {
  busca?: string;
  fase?: string;
}

export function listarTreinos(filtros: FiltrosTreinos = {}): Promise<TreinoResumo[]> {
  const parametros = new URLSearchParams();
  if (filtros.busca && filtros.busca.trim()) {
    parametros.set('busca', filtros.busca.trim());
  }
  if (filtros.fase) {
    parametros.set('fase', filtros.fase);
  }
  const query = parametros.toString();
  return apiRequest<TreinoResumo[]>(`/treinos${query ? `?${query}` : ''}`);
}

export function buscarTreino(id: number): Promise<TreinoDetalhe> {
  return apiRequest<TreinoDetalhe>(`/treinos/${id}`);
}

export function criarTreino(dados: TreinoCriarRequest): Promise<TreinoDetalhe> {
  return apiRequest<TreinoDetalhe>('/treinos', { method: 'POST', body: dados });
}

export function atualizarTreino(id: number, dados: TreinoAtualizarRequest): Promise<TreinoDetalhe> {
  return apiRequest<TreinoDetalhe>(`/treinos/${id}`, { method: 'PUT', body: dados });
}

export function removerTreino(id: number): Promise<void> {
  return apiRequest<void>(`/treinos/${id}`, { method: 'DELETE' });
}
