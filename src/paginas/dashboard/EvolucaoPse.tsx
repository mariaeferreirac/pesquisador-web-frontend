import { useState } from 'react';

import { CartaoPainel } from './CartaoPainel';
import { formatarDecimal } from './formatadores';
import { ROTULO_FASE } from './dashboard.mock';
import type { Fase, EvolucaoPse as EvolucaoPseDados } from './dashboard.mock';

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
 *
 * Interatividade: clicar em uma linha (ou na legenda correspondente) isola aquela
 * série, ocultando as outras duas. Clicar novamente na mesma série (ou na legenda)
 * desfaz o isolamento e volta a mostrar as três linhas.
 */
export function EvolucaoPse({ dados }: { dados: EvolucaoPseDados }) {
  const totalSemanas = dados.semanas.length;
  const [faseIsolada, setFaseIsolada] = useState<Fase | null>(null);

  function alternarIsolamento(fase: Fase) {
    setFaseIsolada((atual) => (atual === fase ? null : fase));
  }

  return (
    <CartaoPainel
      titulo="Evolução da percepção de esforço (PSE média)"
      acao={<span className="painel-cartao__nota">Últimas {totalSemanas} semanas</span>}
      className="painel-evolucao"
    >
      <ul className="painel-legenda">
        {dados.series.map((serie) => {
          const inativa = faseIsolada !== null && faseIsolada !== serie.fase;
          return (
            <li key={serie.fase} className={`painel-legenda__item painel-nivel--${serie.fase}`}>
              <button
                type="button"
                className={`painel-legenda__botao${inativa ? ' painel-legenda__botao--inativo' : ''}`}
                onClick={() => alternarIsolamento(serie.fase)}
                aria-pressed={faseIsolada === serie.fase}
              >
                <span className="painel-legenda__linha" aria-hidden="true" />
                {ROTULO_FASE[serie.fase]}
              </button>
            </li>
          );
        })}
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
            {dados.series.map((serie) => {
              const oculta = faseIsolada !== null && faseIsolada !== serie.fase;
              const pontos = serie.valores.map((v, i) => `${posicaoX(i, totalSemanas)},${posicaoY(v)}`).join(' ');
              return (
                <g key={serie.fase}>
                  <polyline
                    className={`painel-linhas__serie painel-nivel--${serie.fase}${oculta ? ' painel-linhas__serie--oculta' : ''}`}
                    points={pontos}
                  />
                  {/* Faixa invisível e mais larga por cima da linha real, só para facilitar o clique. */}
                  <polyline
                    className="painel-linhas__serie-alvo"
                    points={pontos}
                    onClick={() => alternarIsolamento(serie.fase)}
                  />
                </g>
              );
            })}
          </svg>

          {dados.series.map((serie) => {
            const oculto = faseIsolada !== null && faseIsolada !== serie.fase;
            return serie.valores.map((valor, indice) => (
              <span
                key={`${serie.fase}-${indice}`}
                className={`painel-linhas__ponto painel-nivel--${serie.fase}${oculto ? ' painel-linhas__ponto--oculto' : ''}`}
                style={{ left: `${posicaoX(indice, totalSemanas)}%`, top: `${posicaoY(valor)}%` }}
                onClick={() => alternarIsolamento(serie.fase)}
                title={`${ROTULO_FASE[serie.fase]} · ${dados.semanas[indice]}: PSE ${formatarDecimal(valor)}`}
              />
            ));
          })}
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
