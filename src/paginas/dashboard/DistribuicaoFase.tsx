import { CartaoPainel } from './CartaoPainel';
import { calcularPercentual, formatarInteiro, formatarPercentual } from './formatadores';
import { ROTULO_FASE } from './dashboard.mock';
import type { Fase, FaseEsforco } from './dashboard.mock';

interface Fatia {
  fase: Fase;
  participantes: number;
  pct: number;
  inicio: number;
  fim: number;
}

const COR_FASE: Record<Fase, string> = {
  iniciante: 'var(--painel-azul-claro)',
  intermediario: 'var(--painel-azul)',
  avancado: 'var(--painel-laranja)',
};

function montarFatias(dados: FaseEsforco[]): Fatia[] {
  const total = dados.reduce((soma, item) => soma + item.participantes, 0);
  return dados.reduce<Fatia[]>((acumulado, item) => {
    const pct = calcularPercentual(item.participantes, total);
    const inicio = acumulado.length > 0 ? acumulado[acumulado.length - 1].fim : 0;
    return [
      ...acumulado,
      {
        fase: item.fase,
        participantes: item.participantes,
        pct,
        inicio,
        fim: inicio + pct,
      },
    ];
  }, []);
}

/** Pizza exclusiva da distribuição de participantes entre as 3 fases do programa. */
export function DistribuicaoFase({ dados }: { dados: FaseEsforco[] }) {
  const total = dados.reduce((soma, item) => soma + item.participantes, 0);
  const fatias = montarFatias(dados);
  const gradiente = fatias.map((fatia) => `${COR_FASE[fatia.fase]} ${fatia.inicio}% ${fatia.fim}%`).join(', ');

  return (
    <CartaoPainel titulo="Distribuição por fase" className="painel-fase-pizza">
      <div
        className="painel-pizza"
        style={{ background: `conic-gradient(${gradiente})` }}
        role="img"
        aria-label={`Distribuição por fase (${formatarInteiro(total)} participantes): ${fatias
          .map((fatia) => `${ROTULO_FASE[fatia.fase]} ${formatarPercentual(fatia.pct)}`)
          .join(', ')}`}
      />

      <dl className="painel-esforco-pizza__legenda">
        {fatias.map((fatia) => (
          <div key={fatia.fase} className="painel-esforco-pizza__item">
            <dt>
              <span className="painel-marcador" style={{ background: COR_FASE[fatia.fase] }} aria-hidden="true" />
              {ROTULO_FASE[fatia.fase]}
            </dt>
            <dd>
              <strong>{formatarPercentual(fatia.pct)}</strong>
              <small>{formatarInteiro(fatia.participantes)} participantes</small>
            </dd>
          </div>
        ))}
      </dl>
    </CartaoPainel>
  );
}
