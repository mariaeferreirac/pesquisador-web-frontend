import { CartaoPainel } from './CartaoPainel';
import { calcularPercentual, formatarInteiro, formatarPercentual } from './formatadores';
import type { DistribuicaoSexo as DistribuicaoSexoDados } from './dashboard.mock';

// Raio que faz a circunferência valer ~100, permitindo usar porcentagem direto no dasharray.
const RAIO = 15.9155;

export function DistribuicaoSexo({ dados }: { dados: DistribuicaoSexoDados }) {
  const total = dados.feminino + dados.masculino;
  const pctFeminino = calcularPercentual(dados.feminino, total);
  const pctMasculino = 100 - pctFeminino;

  return (
    <CartaoPainel titulo="Distribuição por sexo" className="painel-sexo">
      <div
        className="painel-rosca"
        role="img"
        aria-label={`${pctFeminino}% feminino e ${pctMasculino}% masculino, de ${formatarInteiro(total)} participantes`}
      >
        <svg viewBox="0 0 42 42" aria-hidden="true">
          <circle className="painel-rosca__trilho" cx="21" cy="21" r={RAIO} />
          <circle
            className="painel-rosca__fatia painel-rosca__fatia--masculino"
            cx="21"
            cy="21"
            r={RAIO}
            strokeDasharray={`${pctMasculino} ${100 - pctMasculino}`}
            strokeDashoffset={-pctFeminino}
          />
          <circle
            className="painel-rosca__fatia painel-rosca__fatia--feminino"
            cx="21"
            cy="21"
            r={RAIO}
            strokeDasharray={`${pctFeminino} ${100 - pctFeminino}`}
          />
        </svg>
        <div className="painel-rosca__centro">
          <strong>{formatarInteiro(total)}</strong>
          <span>participantes</span>
        </div>
      </div>

      <dl className="painel-sexo__legenda">
        <div className="painel-sexo__item">
          <dt>
            <span className="painel-marcador painel-marcador--feminino" aria-hidden="true" />
            Feminino
          </dt>
          <dd>
            <strong>{formatarPercentual(pctFeminino)}</strong>
          </dd>
        </div>
        <div className="painel-sexo__item">
          <dt>
            <span className="painel-marcador painel-marcador--masculino" aria-hidden="true" />
            Masculino
          </dt>
          <dd>
            <strong>{formatarPercentual(pctMasculino)}</strong>
          </dd>
        </div>
      </dl>
    </CartaoPainel>
  );
}
