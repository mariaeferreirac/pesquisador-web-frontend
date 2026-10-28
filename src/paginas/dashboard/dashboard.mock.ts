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

/** As 3 fases do programa de treino (mesmo domínio de `Treino.fase` no backend — não confundir com `Treino.nivel`, que é 1 ou 2). */
export type Fase = 'iniciante' | 'intermediario' | 'avancado';

export const ROTULO_FASE: Record<Fase, string> = {
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

/**
 * Faixas OMNI de percepção subjetiva de esforço (escala 0–10):
 * 0–3 leve · 4–6 moderado · 7–10 intenso.
 */
export type FaixaEsforco = '0-3' | '4-6' | '7-10';

export const ROTULO_FAIXA_ESFORCO: Record<FaixaEsforco, string> = {
  '0-3': 'Esforço 0–3',
  '4-6': 'Esforço 4–6',
  '7-10': 'Esforço 7–10',
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

/** Rótulo curto do período, usado em títulos dinâmicos de indicadores (ex.: "Participantes Ativos (Este Mês)"). */
export const ROTULO_PERIODO_CURTO: Record<PeriodoDias, string> = {
  7: 'Última Semana',
  30: 'Este Mês',
  90: 'Último Trimestre',
  365: 'Último Ano',
};

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
  /**
   * Participantes que realizaram ao menos 1 sessão com 50% ou mais do treino concluído,
   * dentro do período filtrado (`FiltrosDashboard.periodoDias`).
   */
  participantesAtivos: number;
  mediaIdade: number;
  /**
   * Adesão do grupo no período (0–100), relativa à meta de 3 sessões/semana
   * (3 = 100%, 2 ≈ 67%, 1 ≈ 33%, 0 = 0%).
   */
  taxaAdesaoPct: number;
  /** Variação da adesão vs. período anterior, em pontos percentuais. */
  variacaoAdesaoPp: number;
  /** Média de treinos contabilizados por participante por semana (frequência semanal média). */
  frequenciaSemanal: number;
  /**
   * % de sessões contabilizadas (0–100) — regra pretendida: sessão com 50% ou mais do treino
   * realizado. NOTA: hoje o backend grava CONCLUIDA só no fim natural e INTERROMPIDA em
   * qualquer saída manual, independente do % (ver `sessoes.ts` e `useTreinoExecucao.ts`).
   */
  treinosConcluidosPct: number;
  /** % de treinos encerrados antes de 50% (0–100). Sujeito à mesma ressalva acima. */
  treinosInterrompidosPct: number;
}

export interface SerieEsforco {
  fase: Fase;
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

/**
 * Alerta de esforço configurável pelo pesquisador.
 * O título é montado dinamicamente (`montarTituloAlerta`); a descrição é texto livre
 * editável no formulário (com sugestão padrão por faixa OMNI).
 */
export interface AlertaEsforco {
  id: string;
  severidade: SeveridadeAlerta;
  /** Texto exibido no card (ex.: "Risco de lesão ou desistência."). */
  descricao: string;
  fase: Fase;
  faixaEsforco: FaixaEsforco;
  /** Quantidade mínima de treinos seguidos na faixa para disparar o alerta. */
  treinosSeguidosMinimos: number;
  /**
   * Limiar (% dos participantes ativos da fase) a partir do qual o alerta é considerado
   * disparado. Definido pelo pesquisador ao cadastrar/editar a regra.
   */
  pctMinimoAtivos: number;
  /** % atual do grupo afetado sobre os ativos da fase (resultado do backend / mock). */
  pctGrupo: number;
  participantes: string[];
}

export const ROTULO_FASE_PLURAL: Record<Fase, string> = {
  iniciante: 'iniciantes',
  intermediario: 'intermediários',
  avancado: 'avançados',
};

/** Sugestão inicial de descrição conforme a faixa OMNI escolhida. */
export function descricaoPadraoAlerta(faixaEsforco: FaixaEsforco): string {
  if (faixaEsforco === '7-10') return 'Risco de lesão ou desistência.';
  if (faixaEsforco === '0-3') return 'Esforço abaixo do esperado para a fase.';
  return 'Esforço moderado recorrente acima do limiar.';
}

/** "[X] [fase]s com [faixa] em [Y] ou mais treinos" */
export function montarTituloAlerta(alerta: Pick<AlertaEsforco, 'fase' | 'faixaEsforco' | 'treinosSeguidosMinimos' | 'participantes'>): string {
  const quantidade = alerta.participantes.length;
  return `${quantidade} ${ROTULO_FASE_PLURAL[alerta.fase]} com ${ROTULO_FAIXA_ESFORCO[alerta.faixaEsforco].toLowerCase()} em ${alerta.treinosSeguidosMinimos} ou mais treinos`;
}

export interface AlertasEsforco {
  alertas: AlertaEsforco[];
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
  /**
   * Mesma regra da taxa de adesão do painel, por faixa etária
   * (meta de 3 sessões/semana = 100%).
   */
  taxaAdesaoPct: number;
}

export interface ContagemEsforco {
  faixa: FaixaEsforco;
  participantes: number;
}

export interface FaseEsforco {
  fase: Fase;
  participantes: number;
  porEsforco: ContagemEsforco[];
}

export interface ProgressaoFase {
  iniciantesParaIntermediario: number;
  /** % de iniciantes que progrediram para intermediário no período, sobre o total de iniciantes. */
  iniciantesParaIntermediarioPct: number;
  intermediariosParaAvancado: number;
  /** % de intermediários que progrediram para avançado no período, sobre o total de intermediários. */
  intermediariosParaAvancadoPct: number;
  /** Tempo médio, em semanas, até a mudança de fase. */
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
  fasesEsforco: FaseEsforco[];
  progressaoFase: ProgressaoFase;
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
    treinosConcluidosPct: 86,
    treinosInterrompidosPct: 14,
  },

  evolucaoPse: {
    semanas: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    series: [
      { fase: 'iniciante', valores: [6.8, 6.6, 6.4, 6.1, 5.9, 5.6, 5.4, 5.2] },
      { fase: 'intermediario', valores: [6.6, 6.5, 6.5, 6.4, 6.3, 6.2, 6.1, 6.0] },
      { fase: 'avancado', valores: [6.8, 6.8, 6.7, 6.8, 6.7, 6.8, 6.7, 6.7] },
    ],
    leitura:
      'Iniciantes caíram de 6,8 para 5,2 com o mesmo plano: sinal de que parte deles já pode progredir de fase.',
  },

  alertasEsforco: {
    alertas: [
      {
        id: 'iniciantes-esforco-alto',
        severidade: 'critico',
        descricao: 'Risco de lesão ou desistência.',
        fase: 'iniciante',
        faixaEsforco: '7-10',
        treinosSeguidosMinimos: 3,
        pctMinimoAtivos: 2,
        pctGrupo: 3,
        participantes: [
          'Maria das Graças Silva',
          'José Carlos Pereira',
          'Antônia Ferreira Lima',
          'Sebastião Almeida Souza',
          'Francisca Rodrigues Costa',
          'Raimundo Nonato Alves',
          'Joana Martins Barbosa',
          'Pedro Henrique Gomes',
          'Terezinha Oliveira Dias',
          'Manoel Aparecido Teixeira',
          'Luzia Fernandes Cardoso',
          'Aparecido Donizete Ramos',
        ],
      },
    ],
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

  fasesEsforco: [
    {
      fase: 'iniciante',
      participantes: 385,
      porEsforco: [
        { faixa: '0-3', participantes: 250 },
        { faixa: '4-6', participantes: 100 },
        { faixa: '7-10', participantes: 35 },
      ],
    },
    {
      fase: 'intermediario',
      participantes: 578,
      porEsforco: [
        { faixa: '0-3', participantes: 116 },
        { faixa: '4-6', participantes: 405 },
        { faixa: '7-10', participantes: 57 },
      ],
    },
    {
      fase: 'avancado',
      participantes: 321,
      porEsforco: [
        { faixa: '0-3', participantes: 16 },
        { faixa: '4-6', participantes: 80 },
        { faixa: '7-10', participantes: 225 },
      ],
    },
  ],

  progressaoFase: {
    iniciantesParaIntermediario: 42,
    iniciantesParaIntermediarioPct: 11,
    intermediariosParaAvancado: 19,
    intermediariosParaAvancadoPct: 3,
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
