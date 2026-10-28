import { BarraProgresso } from './BarraProgresso';
import { CartaoPainel } from './CartaoPainel';
import { calcularPercentual, formatarInteiro, formatarPercentual } from './formatadores';
import { ROTULO_FAIXA_ESFORCO, ROTULO_FASE } from './dashboard.mock';
import type { FaseEsforco } from './dashboard.mock';

/**
 * Detalha a percepção de esforço (faixas OMNI 0–3 / 4–6 / 7–10) dentro de cada fase.
 * A distribuição geral entre fases fica no gráfico de pizza (`DistribuicaoFase`),
 * por isso este card não repete a barra/% de participação por fase.
 */
export function DistribuicaoFaseEsforco({ dados }: { dados: FaseEsforco[] }) {
  return (
    <CartaoPainel titulo="Distribuição por fase e percepção de esforço" className="painel-niveis">
      <div className="painel-niveis__grade">
        {dados.map((fase) => (
          <article key={fase.fase} className={`painel-nivel painel-nivel--${fase.fase}`}>
            <header className="painel-nivel__cabecalho">
              <h3>{ROTULO_FASE[fase.fase]}</h3>
              <span>{formatarInteiro(fase.participantes)} participantes</span>
            </header>

            <ul className="painel-lista-barras painel-lista-barras--compacta">
              {fase.porEsforco.map((esforco) => {
                const pct = calcularPercentual(esforco.participantes, fase.participantes);
                return (
                  <li key={esforco.faixa}>
                    <div className="painel-linha-rotulo">
                      <span>{ROTULO_FAIXA_ESFORCO[esforco.faixa]}</span>
                      <span>
                        <strong>{formatarPercentual(pct)}</strong>{' '}
                        <small>({formatarInteiro(esforco.participantes)})</small>
                      </span>
                    </div>
                    <BarraProgresso
                      className="painel-barra--fina"
                      valor={pct}
                      rotulo={`${ROTULO_FASE[fase.fase]}, ${ROTULO_FAIXA_ESFORCO[esforco.faixa]}`}
                    />
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </CartaoPainel>
  );
}
