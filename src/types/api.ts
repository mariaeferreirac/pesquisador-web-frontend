// Schema de erro retornado pelo backend (src/server.ts e src/routes/*.ts): { error: string }.
export interface ErroApi {
  error: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Exercicio {
  id: number;
  nome: string;
  videoUrl: string;
  instrucao: string[];
  categoriaId: number;
  nivel: number;
  ativo: boolean;
  criadoEm?: string;
}

export interface TreinoExercicioInput {
  exercicioId: number;
  ordem: number;
  series: number;
  descansoSegundos: number;
  duracaoEstimadaSegundos: number;
  multiplicadorVelocidade: number;
}

export interface Treino {
  id: number;
  nome: string;
  descricao: string;
  fase: string;
  nivel: number;
  quantidadeSemanas: number;
  ativo: boolean;
}
