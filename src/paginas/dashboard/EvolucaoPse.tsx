import { CartaoPainel } from './CartaoPainel';
import { formatarDecimal } from './formatadores';
import { ROTULO_NIVEL } from './dashboard.mock';
import type { EvolucaoPse as EvolucaoPseDados } from './dashboard.mock';

const PSE_MAXIMA = 10;
const MARCAS_EIXO_Y = [0, 2.5, 5, 7.5, 10];

// Margem horizontal (em %) para os pontos das pontas não ficarem cortados.
const MARGEM_X = 4;

function posicaoX(indice: number, total: number): number {
  if (total <= 1) return 50;
  return MARGEM_X + (indice * (100 - 2 * MARGEM_X)) / (total - 1);
}

function posicaoY(valor: number): number {
  return 100 - (valor / PSE_MAXIMA) * 100;
}

/**
 * Linhas desenhadas em SVG com viewBox 0–100 esticado (preserveAspectRatio="none") e
 * `vector-effect: non-scaling-stroke`; rótulos e pontos são HTML posicionados em %.
 * Assim o gráfico ocupa qualquer largura de card sem distorcer textos ou círculos.
 */
export function EvolucaoPse({ dados }: { dados: EvolucaoPseDados }) {
  const totalSemanas = dados.semanas.length;

  return (
    <CartaoPainel
      titulo="Evolução da percepção de esforço (PSE média)"
      acao={<span className="painel-cartao__nota">Últimas {totalSemanas} semanas</span>}
      className="painel-evolucao"
    >
      <ul className="painel-legenda">
        {dados.series.map((serie) => (
          <li key={serie.nivel} className={`painel-legenda__item painel-nivel--${serie.nivel}`}>
            <span className="painel-legenda__linha" aria-hidden="true" />
            {ROTULO_NIVEL[serie.nivel]}
          </li>
        ))}
      </ul>

      <div
        className="painel-linhas"
        role="img"
        aria-label={`Evolução semanal da percepção de esforço. ${dados.leitura}`}
      >
        <div className="painel-linhas__eixo-y" aria-hidden="true">
          {MARCAS_EIXO_Y.map((marca) => (
            <span key={marca} style={{ bottom: `${(marca / PSE_MAXIMA) * 100}%` }}>
              {Number.isInteger(marca) ? marca : formatarDecimal(marca)}
            </span>
          ))}
        </div>

        <div className="painel-linhas__area">
          {MARCAS_EIXO_Y.map((marca) => (
            <div
              key={marca}
              className="painel-linhas__grade"
              style={{ bottom: `${(marca / PSE_MAXIMA) * 100}%` }}
            />
          ))}

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {dados.series.map((serie) => (
              <polyline
                key={serie.nivel}
                className={`painel-linhas__serie painel-nivel--${serie.nivel}`}
                points={serie.valores.map((v, i) => `${posicaoX(i, totalSemanas)},${posicaoY(v)}`).join(' ')}
              />
            ))}
          </svg>

          {dados.series.map((serie) =>
            serie.valores.map((valor, indice) => (
              <span
                key={`${serie.nivel}-${indice}`}
                className={`painel-linhas__ponto painel-nivel--${serie.nivel}`}
                style={{ left: `${posicaoX(indice, totalSemanas)}%`, top: `${posicaoY(valor)}%` }}
                title={`${ROTULO_NIVEL[serie.nivel]} · ${dados.semanas[indice]}: PSE ${formatarDecimal(valor)}`}
              />
            )),
          )}
        </div>

        <div className="painel-linhas__eixo-x" aria-hidden="true">
          {dados.semanas.map((semana, indice) => (
            <span key={semana} style={{ left: `${posicaoX(indice, totalSemanas)}%` }}>
              {semana}
            </span>
          ))}
        </div>
      </div>

      <p className="painel-evolucao__leitura">
        <span className="painel-evolucao__marcador" aria-hidden="true" />
        {dados.leitura}
      </p>
    </CartaoPainel>
  );
}
