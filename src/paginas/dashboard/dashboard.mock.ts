/**
 * Contrato de dados + dados mockados do Painel de indicadores.
 *
 * Arquitetura mock-first: toda a tela consome `DashboardDados`. Hoje esse objeto vem
 * de `dashboardMock`; quando o backend existir, basta trocar a implementação de
 * `buscarDashboard` em `src/api/dashboard.ts` — nenhum componente precisa mudar.
 *
 * Convenções:
 *  - Percentuais derivados (ex.: % de cada faixa etária) NÃO são armazenados: o front
 *    calcula a partir das contagens, evitando inconsistência entre números.
 *  - Taxas que o backend calcula (adesão, resposta) vêm em 0–100.
 */

// ---------------------------------------------------------------------------
// Domínio
// ---------------------------------------------------------------------------

export type NivelTreino = 'iniciante' | 'intermediario' | 'avancado';

export const ROTULO_NIVEL: Record<NivelTreino, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

/** Faixas etárias do estudo (público 60+). */
export type FaixaEtaria = '60-64' | '65-69' | '70-74' | '75-79' | '80+';

export const ROTULO_FAIXA_ETARIA: Record<FaixaEtaria, string> = {
  '60-64': '60–64 anos',
  '65-69': '65–69 anos',
  '70-74': '70–74 anos',
  '75-79': '75–79 anos',
  '80+': '80+ anos',
};

/** Faixas de percepção subjetiva de esforço (escala 0–10). */
export type FaixaEsforco = '1-4' | '5-7' | '8-10';

export const ROTULO_FAIXA_ESFORCO: Record<FaixaEsforco, string> = {
  '1-4': 'Esforço 1–4',
  '5-7': 'Esforço 5–7',
  '8-10': 'Esforço 8–10',
};

// ---------------------------------------------------------------------------
// Filtros globais (não há filtro de instituição, por decisão de escopo)
// ---------------------------------------------------------------------------

export type PeriodoDias = 7 | 30 | 90 | 365;
export type FiltroSexo = 'todos' | 'feminino' | 'masculino';
export type FiltroFaixaEtaria = 'todas' | FaixaEtaria;

export interface FiltrosDashboard {
  periodoDias: PeriodoDias;
  sexo: FiltroSexo;
  faixaEtaria: FiltroFaixaEtaria;
}

export const FILTROS_PADRAO: FiltrosDashboard = {
  periodoDias: 30,
  sexo: 'todos',
  faixaEtaria: 'todas',
};

export interface OpcaoFiltro<T> {
  valor: T;
  rotulo: string;
}

export const OPCOES_PERIODO: OpcaoFiltro<PeriodoDias>[] = [
  { valor: 7, rotulo: 'últimos 7 dias' },
  { valor: 30, rotulo: 'últimos 30 dias' },
  { valor: 90, rotulo: 'últimos 90 dias' },
  { valor: 365, rotulo: 'últimos 12 meses' },
];

export const OPCOES_SEXO: OpcaoFiltro<FiltroSexo>[] = [
  { valor: 'todos', rotulo: 'todos' },
  { valor: 'feminino', rotulo: 'feminino' },
  { valor: 'masculino', rotulo: 'masculino' },
];

export const OPCOES_FAIXA_ETARIA: OpcaoFiltro<FiltroFaixaEtaria>[] = [
  { valor: 'todas', rotulo: 'todas' },
  { valor: '60-64', rotulo: ROTULO_FAIXA_ETARIA['60-64'] },
  { valor: '65-69', rotulo: ROTULO_FAIXA_ETARIA['65-69'] },
  { valor: '70-74', rotulo: ROTULO_FAIXA_ETARIA['70-74'] },
  { valor: '75-79', rotulo: ROTULO_FAIXA_ETARIA['75-79'] },
  { valor: '80+', rotulo: ROTULO_FAIXA_ETARIA['80+'] },
];

// ---------------------------------------------------------------------------
// Contrato dos dados
// ---------------------------------------------------------------------------

export interface KpisDashboard {
  totalParticipantes: number;
  /** Crescimento do total de participantes no mês, em %. */
  variacaoTotalMensalPct: number;
  participantesAtivos: number;
  mediaIdade: number;
  /** Taxa de adesão (0–100). */
  taxaAdesaoPct: number;
  /** Variação da adesão vs. período anterior, em pontos percentuais. */
  variacaoAdesaoPp: number;
  /** Média de treinos por participante por semana. */
  frequenciaSemanal: number;
  metaFrequenciaSemanal: number;
  /** % de treinos concluídos até o fim (0–100). */
  treinosConcluidosPct: number;
  /** % de treinos encerrados antes do fim (0–100). */
  treinosInterrompidosPct: number;
}

export interface SerieEsforco {
  nivel: NivelTreino;
  /** PSE média por semana (0–10); mesmo tamanho de `EvolucaoPse.semanas`. */
  valores: number[];
}

export interface EvolucaoPse {
  /** Rótulos do eixo X (uma entrada por semana). */
  semanas: string[];
  series: SerieEsforco[];
  /** Leitura interpretativa exibida abaixo do gráfico. */
  leitura: string;
}

export type SeveridadeAlerta = 'critico' | 'informativo';

export interface AlertaEsforco {
  id: string;
  severidade: SeveridadeAlerta;
  titulo: string;
  descricao: string;
}

export interface AlertasEsforco {
  alertas: AlertaEsforco[];
  /** Taxa de resposta à avaliação pós-treino (0–100). */
  taxaRespostaAvaliacaoPosTreinoPct: number;
}

export interface DistribuicaoSexo {
  feminino: number;
  masculino: number;
}

export interface ContagemFaixaEtaria {
  faixa: FaixaEtaria;
  participantes: number;
}

export interface AdesaoFaixaEtaria {
  faixa: FaixaEtaria;
  /** Taxa de adesão (0–100). */
  taxaAdesaoPct: number;
}

export interface ContagemEsforco {
  faixa: FaixaEsforco;
  participantes: number;
}

export interface NivelEsforco {
  nivel: NivelTreino;
  participantes: number;
  porEsforco: ContagemEsforco[];
}

export interface ProgressaoNivel {
  iniciantesParaIntermediario: number;
  intermediariosParaAvancado: number;
  /** Tempo médio, em semanas, até a mudança de nível. */
  semanasMediasAteIntermediario: number;
  semanasMediasAteAvancado: number;
}

export interface DashboardDados {
  kpis: KpisDashboard;
  evolucaoPse: EvolucaoPse;
  alertasEsforco: AlertasEsforco;
  distribuicaoSexo: DistribuicaoSexo;
  distribuicaoIdade: ContagemFaixaEtaria[];
  adesaoPorFaixaEtaria: AdesaoFaixaEtaria[];
  niveisEsforco: NivelEsforco[];
  progressaoNivel: ProgressaoNivel;
}

// ---------------------------------------------------------------------------
// Dados mockados (coerentes entre si: 1.284 participantes em todas as quebras)
// ---------------------------------------------------------------------------

export const dashboardMock: DashboardDados = {
  kpis: {
    totalParticipantes: 1284,
    variacaoTotalMensalPct: 12,
    participantesAtivos: 1150,
    mediaIdade: 68,
    taxaAdesaoPct: 74,
    variacaoAdesaoPp: 5,
    frequenciaSemanal: 2.3,
    metaFrequenciaSemanal: 3,
    treinosConcluidosPct: 86,
    treinosInterrompidosPct: 14,
  },

  evolucaoPse: {
    semanas: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    series: [
      { nivel: 'iniciante', valores: [6.8, 6.6, 6.4, 6.1, 5.9, 5.6, 5.4, 5.2] },
      { nivel: 'intermediario', valores: [6.6, 6.5, 6.5, 6.4, 6.3, 6.2, 6.1, 6.0] },
      { nivel: 'avancado', valores: [6.8, 6.8, 6.7, 6.8, 6.7, 6.8, 6.7, 6.7] },
    ],
    leitura:
      'Iniciantes caíram de 6,8 para 5,2 com o mesmo plano: sinal de que parte deles já pode progredir de nível.',
  },

  alertasEsforco: {
    alertas: [
      {
        id: 'iniciantes-esforco-alto',
        severidade: 'critico',
        titulo: '12 iniciantes com esforço 8–10',
        descricao: 'em 3 ou mais treinos seguidos. Risco de lesão ou desistência.',
      },
      {
        id: 'avancados-esforco-baixo',
        severidade: 'informativo',
        titulo: '9 avançados sempre com esforço 1–4',
        descricao: 'Treino provavelmente fácil demais. Revisar carga.',
      },
    ],
    taxaRespostaAvaliacaoPosTreinoPct: 78,
  },

  distribuicaoSexo: { feminino: 770, masculino: 514 },

  distribuicaoIdade: [
    { faixa: '60-64', participantes: 334 },
    { faixa: '65-69', participantes: 411 },
    { faixa: '70-74', participantes: 283 },
    { faixa: '75-79', participantes: 167 },
    { faixa: '80+', participantes: 89 },
  ],

  adesaoPorFaixaEtaria: [
    { faixa: '60-64', taxaAdesaoPct: 78 },
    { faixa: '65-69', taxaAdesaoPct: 76 },
    { faixa: '70-74', taxaAdesaoPct: 73 },
    { faixa: '75-79', taxaAdesaoPct: 67 },
    { faixa: '80+', taxaAdesaoPct: 61 },
  ],

  niveisEsforco: [
    {
      nivel: 'iniciante',
      participantes: 385,
      porEsforco: [
        { faixa: '1-4', participantes: 250 },
        { faixa: '5-7', participantes: 100 },
        { faixa: '8-10', participantes: 35 },
      ],
    },
    {
      nivel: 'intermediario',
      participantes: 578,
      porEsforco: [
        { faixa: '1-4', participantes: 116 },
        { faixa: '5-7', participantes: 405 },
        { faixa: '8-10', participantes: 57 },
      ],
    },
    {
      nivel: 'avancado',
      participantes: 321,
      porEsforco: [
        { faixa: '1-4', participantes: 16 },
        { faixa: '5-7', participantes: 80 },
        { faixa: '8-10', participantes: 225 },
      ],
    },
  ],

  progressaoNivel: {
    iniciantesParaIntermediario: 42,
    intermediariosParaAvancado: 19,
    semanasMediasAteIntermediario: 9,
    semanasMediasAteAvancado: 14,
  },
};

/**
 * Simula a chamada ao backend (latência + payload). Consumido apenas por
 * `src/api/dashboard.ts`. Os filtros ainda não alteram os números: eles existem
 * no contrato para o backend aplicá-los quando a rota for criada.
 */
export function buscarDashboardMock(_filtros: FiltrosDashboard): Promise<DashboardDados> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(dashboardMock)), 350);
  });
}
