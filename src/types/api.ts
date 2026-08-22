// Schema de erro padronizado esperado da API (código + mensagem).
export interface ErroApi {
  codigo: string;
  mensagem: string;
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
  ativo: boolean;
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
