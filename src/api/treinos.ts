import { apiRequest } from './client';
import type { Treino, TreinoExercicioInput } from '../types/api';

// Rotas ainda não existem no backend.
export function listarTreinos(): Promise<Treino[]> {
  return apiRequest<Treino[]>('/treinos');
}

export function buscarTreino(id: number): Promise<Treino> {
  return apiRequest<Treino>(`/treinos/${id}`);
}

export interface CriarTreinoInput {
  nome: string;
  descricao: string;
  fase: string;
  nivel: number;
  quantidadeSemanas: number;
  exercicios: TreinoExercicioInput[];
}

export function criarTreino(dados: CriarTreinoInput): Promise<Treino> {
  return apiRequest<Treino>('/treinos', { method: 'POST', body: dados });
}
