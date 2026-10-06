import { BarraProgresso } from './BarraProgresso';
import { CartaoPainel } from './CartaoPainel';
import { calcularPercentual, formatarInteiro, formatarPercentual } from './formatadores';
import { ROTULO_FAIXA_ESFORCO, ROTULO_NIVEL } from './dashboard.mock';
import type { NivelEsforco } from './dashboard.mock';

export function DistribuicaoNivelEsforco({ dados }: { dados: NivelEsforco[] }) {
  const totalGeral = dados.reduce((soma, nivel) => soma + nivel.participantes, 0);

  return (
    <CartaoPainel titulo="Distribuição por nível e percepção de esforço" className="painel-niveis">
      <div className="painel-niveis__grade">
        {dados.map((nivel) => {
          const pctNivel = calcularPercentual(nivel.participantes, totalGeral);
          return (
            <article key={nivel.nivel} className={`painel-nivel painel-nivel--${nivel.nivel}`}>
              <header className="painel-nivel__cabecalho">
                <h3>{ROTULO_NIVEL[nivel.nivel]}</h3>
                <span>{formatarInteiro(nivel.participantes)} participantes</span>
              </header>

              <div className="painel-nivel__total">
                <BarraProgresso
                  className="painel-barra--grossa"
                  valor={pctNivel}
                  textoInterno={formatarPercentual(pctNivel)}
                  rotulo={`${ROTULO_NIVEL[nivel.nivel]}: ${pctNivel}% dos participantes`}
                />
              </div>

              <ul className="painel-lista-barras painel-lista-barras--compacta">
                {nivel.porEsforco.map((esforco) => {
                  const pct = calcularPercentual(esforco.participantes, nivel.participantes);
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
                        rotulo={`${ROTULO_NIVEL[nivel.nivel]}, ${ROTULO_FAIXA_ESFORCO[esforco.faixa]}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </CartaoPainel>
  );
}
