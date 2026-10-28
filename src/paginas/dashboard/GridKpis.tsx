import { DicaInfo } from './DicaInfo';
import { calcularPercentual, formatarComSinal, formatarInteiro, formatarPercentual } from './formatadores';
import { ROTULO_PERIODO_CURTO } from './dashboard.mock';
import type { KpisDashboard, PeriodoDias } from './dashboard.mock';

/** `positivo`/`negativo`/`atencao` aparecem como "pílula" colorida; `neutro` é texto simples. */
type Tom = 'positivo' | 'negativo' | 'atencao' | 'neutro';

interface CartaoKpi {
  id: string;
  rotulo: string;
  valor: string;
  complemento?: string;
  /** Texto explicativo exibido no balão do ícone "i" ao lado do rótulo. */
  dica?: string;
  tom: Tom;
}

function tomDaVariacao(variacao: number): Tom {
  if (variacao > 0) return 'positivo';
  if (variacao < 0) return 'negativo';
  return 'neutro';
}

const DICA_ADESAO =
  'Percentual de adesão do grupo no período filtrado, em relação à meta de 3 sessões por semana (3 = 100%, 2 = 67%, 1 = 33%, 0 = 0%).';

function montarCartoes(kpis: KpisDashboard, periodoDias: PeriodoDias): CartaoKpi[] {
  return [
    {
      id: 'total',
      rotulo: 'Total de participantes',
      valor: formatarInteiro(kpis.totalParticipantes),
      complemento: `${formatarComSinal(kpis.variacaoTotalMensalPct)}% este mês`,
      tom: tomDaVariacao(kpis.variacaoTotalMensalPct),
    },
    {
      id: 'ativos',
      rotulo: `Participantes ativos (${ROTULO_PERIODO_CURTO[periodoDias]})`,
      valor: formatarInteiro(kpis.participantesAtivos),
      complemento: `${formatarPercentual(calcularPercentual(kpis.participantesAtivos, kpis.totalParticipantes))} do total`,
      dica: 'Número total de participantes que realizaram pelo menos 1 sessão com pelo menos 50% da sessão concluída no período filtrado.',
      tom: 'neutro',
    },
    {
      id: 'adesao',
      rotulo: 'Taxa de adesão',
      valor: formatarPercentual(kpis.taxaAdesaoPct),
      complemento: `${formatarComSinal(kpis.variacaoAdesaoPp)} p.p. vs. mês anterior`,
      dica: DICA_ADESAO,
      tom: tomDaVariacao(kpis.variacaoAdesaoPp),
    },
    {
      id: 'frequencia',
      rotulo: 'Frequência semanal média',
      valor: `${formatarInteiro(Math.round(kpis.frequenciaSemanal))}x`,
      tom: 'neutro',
    },
    {
      id: 'contabilizados',
      rotulo: 'Treinos contabilizados',
      valor: formatarPercentual(kpis.treinosConcluidosPct),
      complemento: `${formatarPercentual(kpis.treinosInterrompidosPct)} encerrados antes de 50%`,
      tom: kpis.treinosInterrompidosPct > 0 ? 'atencao' : 'neutro',
    },
    {
      id: 'idade',
      rotulo: 'Média de idade',
      valor: formatarInteiro(kpis.mediaIdade),
      complemento: 'anos',
      tom: 'neutro',
    },
  ];
}

export function GridKpis({ kpis, periodoDias }: { kpis: KpisDashboard; periodoDias: PeriodoDias }) {
  return (
    <ul className="painel-kpis" aria-label="Indicadores principais">
      {montarCartoes(kpis, periodoDias).map((cartao) => (
        <li key={cartao.id} className="painel-kpi">
          <span className="painel-kpi__rotulo">
            {cartao.rotulo}
            {cartao.dica ? <DicaInfo texto={cartao.dica} /> : null}
          </span>
          <strong className="painel-kpi__valor">{cartao.valor}</strong>
          {cartao.complemento ? (
            <span className={`painel-kpi__complemento painel-kpi__complemento--${cartao.tom}`}>
              {cartao.complemento}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
