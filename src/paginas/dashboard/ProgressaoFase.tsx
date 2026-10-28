import { CartaoPainel } from './CartaoPainel';
import { formatarInteiro, formatarPercentual } from './formatadores';
import type { ProgressaoFase as ProgressaoFaseDados } from './dashboard.mock';

export function ProgressaoFase({ dados }: { dados: ProgressaoFaseDados }) {
  const blocos = [
    {
      id: 'ini-int',
      titulo: 'Iniciante → Intermediário',
      quantidade: dados.iniciantesParaIntermediario,
      pct: dados.iniciantesParaIntermediarioPct,
      base: 'dos iniciantes',
      semanas: dados.semanasMediasAteIntermediario,
    },
    {
      id: 'int-ava',
      titulo: 'Intermediário → Avançado',
      quantidade: dados.intermediariosParaAvancado,
      pct: dados.intermediariosParaAvancadoPct,
      base: 'dos intermediários',
      semanas: dados.semanasMediasAteAvancado,
    },
  ];

  return (
    <CartaoPainel titulo="Progressão de fase no período" className="painel-progressao">
      <ul className="painel-progressao__lista">
        {blocos.map((bloco) => (
          <li key={bloco.id} className="painel-progressao__item">
            <div className="painel-progressao__topo">
              <span className="painel-progressao__titulo">{bloco.titulo}</span>
              <strong className="painel-progressao__valor">{formatarInteiro(bloco.quantidade)}</strong>
            </div>
            <span className="painel-progressao__pct">
              {formatarPercentual(bloco.pct)} {bloco.base}
            </span>
            <span className="painel-progressao__tempo">
              Tempo médio: <strong>{formatarInteiro(bloco.semanas)} semanas</strong>
            </span>
          </li>
        ))}
      </ul>
    </CartaoPainel>
  );
}
