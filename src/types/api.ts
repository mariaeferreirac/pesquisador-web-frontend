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

export type FaseTreino = 'Iniciante' | 'Intermediário' | 'Avançado';
export type NivelTreino = number;

/** Item de exercício vinculado a um treino — formato usado tanto para enviar (POST/PUT) quanto para receber (GET) do backend. */
export interface ExercicioVinculado {
  exercicioId: number;
  series: number;
  descansoSegundos: number;
  multiplicadorVelocidade: number;
}

/** Exercício vinculado enriquecido com nome/categoria para exibição (resolvidos no front a partir da Biblioteca de Exercícios já carregada, não vêm do backend). */
export interface ExercicioVinculadoDetalhado extends ExercicioVinculado {
  nome: string;
  categoria: string;
}

/** Corpo enviado em POST /treinos e PUT /treinos/{id} */
export interface TreinoCriarRequest {
  nome: string;
  instrucoes: string;
  fase: FaseTreino;
  nivel: NivelTreino;
  quantidadeSemanas: number;
  descansoEntreSeriesSegundos: number;
  exercicios: ExercicioVinculado[];
}

/** Corpo enviado em PUT /treinos/{id}. Mesma forma do request de criação */
export type TreinoAtualizarRequest = TreinoCriarRequest;

/** Item retornado por GET /treinos (usado nos cards da listagem) */
export interface TreinoResumo {
  id: number;
  nome: string;
  fase: FaseTreino;
  nivel: NivelTreino;
  quantidadeSemanas: number;
  duracaoEstimadaMinutos: number;
  quantidadeExercicios: number;
}

/** Retornado por GET /treinos/{id}, POST /treinos e PUT /treinos/{id} */
export interface TreinoDetalhe {
  id: number;
  nome: string;
  instrucoes: string;
  fase: FaseTreino;
  nivel: NivelTreino;
  quantidadeSemanas: number;
  descansoEntreSeriesSegundos: number;
  duracaoEstimadaMinutos: number;
  exercicios: ExercicioVinculado[];
}
