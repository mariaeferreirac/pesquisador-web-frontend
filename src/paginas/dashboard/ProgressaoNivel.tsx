import { CartaoPainel } from './CartaoPainel';
import { formatarInteiro } from './formatadores';
import type { ProgressaoNivel as ProgressaoNivelDados } from './dashboard.mock';

export function ProgressaoNivel({ dados }: { dados: ProgressaoNivelDados }) {
  return (
    <CartaoPainel titulo="Progressão de nível no período" className="painel-progressao">
      <ul className="painel-progressao__lista">
        <li className="painel-progressao__item">
          <span>Iniciante → Intermediário</span>
          <strong>{formatarInteiro(dados.iniciantesParaIntermediario)}</strong>
        </li>
        <li className="painel-progressao__item">
          <span>Intermediário → Avançado</span>
          <strong>{formatarInteiro(dados.intermediariosParaAvancado)}</strong>
        </li>
      </ul>

      <dl className="painel-progressao__tempos">
        <div>
          <dt>{formatarInteiro(dados.semanasMediasAteIntermediario)} sem.</dt>
          <dd>tempo médio até intermediário</dd>
        </div>
        <div>
          <dt>{formatarInteiro(dados.semanasMediasAteAvancado)} sem.</dt>
          <dd>tempo médio até avançado</dd>
        </div>
      </dl>
    </CartaoPainel>
  );
}
