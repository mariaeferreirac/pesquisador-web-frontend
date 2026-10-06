import { BarraProgresso } from './BarraProgresso';
import { CartaoPainel } from './CartaoPainel';
import { formatarPercentual } from './formatadores';
import { ROTULO_FAIXA_ETARIA } from './dashboard.mock';
import type { AdesaoFaixaEtaria as AdesaoFaixaEtariaDados } from './dashboard.mock';

export function AdesaoFaixaEtaria({ dados }: { dados: AdesaoFaixaEtariaDados[] }) {
  return (
    <CartaoPainel titulo="Adesão por faixa etária" className="painel-adesao">
      <ul className="painel-lista-barras">
        {dados.map((item) => (
          <li key={item.faixa}>
            <div className="painel-linha-rotulo">
              <span>{ROTULO_FAIXA_ETARIA[item.faixa]}</span>
              <strong>{formatarPercentual(item.taxaAdesaoPct)}</strong>
            </div>
            <BarraProgresso
              valor={item.taxaAdesaoPct}
              rotulo={`Adesão de ${ROTULO_FAIXA_ETARIA[item.faixa]}`}
            />
          </li>
        ))}
      </ul>
    </CartaoPainel>
  );
}
