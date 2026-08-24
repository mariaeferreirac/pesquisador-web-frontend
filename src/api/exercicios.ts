import { apiRequest } from './client';
import type { Exercicio } from '../types/api';

export interface FiltrosExercicios {
  busca?: string;
  categoriaId?: number;
}

export function listarExercicios(filtros: FiltrosExercicios = {}): Promise<Exercicio[]> {
  const parametros = new URLSearchParams();
  if (filtros.busca && filtros.busca.trim()) {
    parametros.set('busca', filtros.busca.trim());
  }
  if (filtros.categoriaId) {
    parametros.set('categoriaId', String(filtros.categoriaId));
  }
  const query = parametros.toString();
  return apiRequest<Exercicio[]>(`/exercicios${query ? `?${query}` : ''}`);
}

export function buscarExercicio(id: number): Promise<Exercicio> {
  return apiRequest<Exercicio>(`/exercicios/${id}`);
}

export interface DadosExercicio {
  nome: string;
  categoriaId: number;
  nivel: number;
  instrucao: string[];
  video?: File;
}

function montarFormData(dados: Partial<DadosExercicio>): FormData {
  const formData = new FormData();
  if (dados.nome !== undefined) formData.set('nome', dados.nome);
  if (dados.categoriaId !== undefined) formData.set('categoriaId', String(dados.categoriaId));
  if (dados.nivel !== undefined) formData.set('nivel', String(dados.nivel));
  if (dados.instrucao !== undefined) formData.set('instrucao', JSON.stringify(dados.instrucao));
  if (dados.video) formData.set('video', dados.video);
  return formData;
}

export function criarExercicio(dados: DadosExercicio & { video: File }): Promise<Exercicio> {
  return apiRequest<Exercicio>('/exercicios', { method: 'POST', body: montarFormData(dados) });
}

export function atualizarExercicio(id: number, dados: Partial<DadosExercicio>): Promise<Exercicio> {
  return apiRequest<Exercicio>(`/exercicios/${id}`, { method: 'PATCH', body: montarFormData(dados) });
}

export function removerExercicio(id: number): Promise<void> {
  return apiRequest<void>(`/exercicios/${id}`, { method: 'DELETE' });
}
