import { IconeAlerta, IconeTendencia } from '../../componentes/icones';
import { BarraProgresso } from './BarraProgresso';
import { CartaoPainel } from './CartaoPainel';
import { formatarPercentual } from './formatadores';
import type { AlertasEsforco as AlertasEsforcoDados } from './dashboard.mock';

export function AlertasEsforco({ dados }: { dados: AlertasEsforcoDados }) {
  return (
    <CartaoPainel titulo="Alertas de esforço" className="painel-alertas">
      <ul className="painel-alertas__lista">
        {dados.alertas.map((alerta) => {
          const Icone = alerta.severidade === 'critico' ? IconeAlerta : IconeTendencia;
          return (
            <li key={alerta.id} className={`painel-alerta painel-alerta--${alerta.severidade}`}>
              <Icone className="painel-alerta__icone" />
              <div>
                <strong className="painel-alerta__titulo">{alerta.titulo}</strong>
                <p className="painel-alerta__descricao">{alerta.descricao}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="painel-alertas__resposta">
        <div className="painel-linha-rotulo">
          <span>Taxa de resposta da avaliação pós-treino</span>
          <strong>{formatarPercentual(dados.taxaRespostaAvaliacaoPosTreinoPct)}</strong>
        </div>
        <BarraProgresso
          valor={dados.taxaRespostaAvaliacaoPosTreinoPct}
          rotulo="Taxa de resposta da avaliação pós-treino"
        />
      </div>
    </CartaoPainel>
  );
}
