import { BarraProgresso } from './BarraProgresso';
import { CartaoPainel } from './CartaoPainel';
import { DicaInfo } from './DicaInfo';
import { formatarPercentual } from './formatadores';
import { ROTULO_FAIXA_ETARIA } from './dashboard.mock';
import type { AdesaoFaixaEtaria as AdesaoFaixaEtariaDados } from './dashboard.mock';

const DICA_ADESAO_FAIXA =
  'Mesma regra da taxa de adesão do painel, calculada por faixa etária: adesão do grupo à meta de 3 sessões por semana (3 = 100%, 2 = 67%, 1 = 33%, 0 = 0%).';

export function AdesaoFaixaEtaria({ dados }: { dados: AdesaoFaixaEtariaDados[] }) {
  return (
    <CartaoPainel
      titulo="Adesão por faixa etária"
      className="painel-adesao"
      acao={<DicaInfo texto={DICA_ADESAO_FAIXA} />}
    >
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
