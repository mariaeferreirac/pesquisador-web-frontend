import { apiRequest } from './client';
import type { Exercicio } from '../types/api';

// Essas rotas ainda não existem no backend, essa é apenas a estrutura já usada na tela de treino do app mobile (services/treinoService.ts).
export function listarExercicios(): Promise<Exercicio[]> {
  return apiRequest<Exercicio[]>('/exercicios');
}

export function buscarExercicio(id: number): Promise<Exercicio> {
  return apiRequest<Exercicio>(`/exercicios/${id}`);
}

export interface CriarExercicioInput {
  nome: string;
  categoriaId: number;
  videoUrl: string;
  instrucao: string[];
}

export function criarExercicio(dados: CriarExercicioInput): Promise<Exercicio> {
  return apiRequest<Exercicio>('/exercicios', { method: 'POST', body: dados });
}

export function atualizarExercicio(id: number, dados: Partial<CriarExercicioInput>): Promise<Exercicio> {
  return apiRequest<Exercicio>(`/exercicios/${id}`, { method: 'PATCH', body: dados });
}

export function removerExercicio(id: number): Promise<void> {
  return apiRequest<void>(`/exercicios/${id}`, { method: 'DELETE' });
}
