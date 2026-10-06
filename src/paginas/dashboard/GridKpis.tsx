import { calcularPercentual, formatarComSinal, formatarDecimal, formatarInteiro, formatarPercentual } from './formatadores';
import type { KpisDashboard } from './dashboard.mock';

/** `positivo`/`negativo`/`atencao` aparecem como "pílula" colorida; `neutro` é texto simples. */
type Tom = 'positivo' | 'negativo' | 'atencao' | 'neutro';

interface CartaoKpi {
  id: string;
  rotulo: string;
  valor: string;
  complemento: string;
  tom: Tom;
}

function tomDaVariacao(variacao: number): Tom {
  if (variacao > 0) return 'positivo';
  if (variacao < 0) return 'negativo';
  return 'neutro';
}

function montarCartoes(kpis: KpisDashboard): CartaoKpi[] {
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
      rotulo: 'Participantes ativos',
      valor: formatarInteiro(kpis.participantesAtivos),
      complemento: `${formatarPercentual(calcularPercentual(kpis.participantesAtivos, kpis.totalParticipantes))} do total`,
      tom: 'neutro',
    },
    {
      id: 'idade',
      rotulo: 'Média de idade',
      valor: formatarInteiro(kpis.mediaIdade),
      complemento: 'anos',
      tom: 'neutro',
    },
    {
      id: 'adesao',
      rotulo: 'Taxa de adesão',
      valor: formatarPercentual(kpis.taxaAdesaoPct),
      complemento: `${formatarComSinal(kpis.variacaoAdesaoPp)} p.p. vs. mês anterior`,
      tom: tomDaVariacao(kpis.variacaoAdesaoPp),
    },
    {
      id: 'frequencia',
      rotulo: 'Frequência semanal',
      valor: `${formatarDecimal(kpis.frequenciaSemanal)}x`,
      complemento: `meta: ${formatarInteiro(kpis.metaFrequenciaSemanal)}x por semana`,
      tom: 'neutro',
    },
    {
      id: 'concluidos',
      rotulo: 'Treinos concluídos',
      valor: formatarPercentual(kpis.treinosConcluidosPct),
      complemento: `${formatarPercentual(kpis.treinosInterrompidosPct)} encerrados antes do fim`,
      tom: kpis.treinosInterrompidosPct > 0 ? 'atencao' : 'neutro',
    },
  ];
}

export function GridKpis({ kpis }: { kpis: KpisDashboard }) {
  return (
    <ul className="painel-kpis" aria-label="Indicadores principais">
      {montarCartoes(kpis).map((cartao) => (
        <li key={cartao.id} className="painel-kpi">
          <span className="painel-kpi__rotulo">{cartao.rotulo}</span>
          <strong className="painel-kpi__valor">{cartao.valor}</strong>
          <span className={`painel-kpi__complemento painel-kpi__complemento--${cartao.tom}`}>
            {cartao.complemento}
          </span>
        </li>
      ))}
    </ul>
  );
}
