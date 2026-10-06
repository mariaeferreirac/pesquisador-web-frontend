import { CartaoPainel } from './CartaoPainel';
import { calcularPercentual, formatarInteiro, formatarPercentual } from './formatadores';
import { ROTULO_FAIXA_ETARIA } from './dashboard.mock';
import type { ContagemFaixaEtaria } from './dashboard.mock';

export function DistribuicaoIdade({ dados }: { dados: ContagemFaixaEtaria[] }) {
  const total = dados.reduce((soma, item) => soma + item.participantes, 0);
  const maior = Math.max(...dados.map((item) => item.participantes), 1);

  return (
    <CartaoPainel titulo="Distribuição por idade" className="painel-idade">
      <ul className="painel-colunas">
        {dados.map((item) => {
          const pct = calcularPercentual(item.participantes, total);
          return (
            <li
              key={item.faixa}
              className="painel-coluna"
              title={`${ROTULO_FAIXA_ETARIA[item.faixa]}: ${formatarInteiro(item.participantes)} participantes (${pct}%)`}
            >
              <span className="painel-coluna__valor">
                <strong>{formatarInteiro(item.participantes)}</strong>
                <span>{formatarPercentual(pct)}</span>
              </span>
              <div className="painel-coluna__trilho">
                <div
                  className="painel-coluna__barra"
                  style={{ height: `${(item.participantes / maior) * 100}%` }}
                />
              </div>
              <span className="painel-coluna__rotulo">{ROTULO_FAIXA_ETARIA[item.faixa]}</span>
            </li>
          );
        })}
      </ul>
    </CartaoPainel>
  );
}
