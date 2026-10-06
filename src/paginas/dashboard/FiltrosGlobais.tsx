import { IconeChevronBaixo } from '../../componentes/icones';
import { OPCOES_FAIXA_ETARIA, OPCOES_PERIODO, OPCOES_SEXO } from './dashboard.mock';
import type { FiltroFaixaEtaria, FiltroSexo, FiltrosDashboard, OpcaoFiltro, PeriodoDias } from './dashboard.mock';

interface FiltrosGlobaisProps {
  filtros: FiltrosDashboard;
  onChange: <K extends keyof FiltrosDashboard>(chave: K, valor: FiltrosDashboard[K]) => void;
}

interface SeletorProps<T extends string | number> {
  rotulo: string;
  valor: T;
  opcoes: OpcaoFiltro<T>[];
  onChange: (valor: T) => void;
}

function Seletor<T extends string | number>({ rotulo, valor, opcoes, onChange }: SeletorProps<T>) {
  return (
    <label className="painel-filtro">
      <span className="painel-filtro__rotulo">{rotulo}:</span>
      <select
        className="painel-filtro__select"
        value={valor}
        onChange={(evento) => {
          // O valor do <select> é sempre string; recupera o original (número ou texto) da lista de opções.
          const escolhida = opcoes.find((opcao) => String(opcao.valor) === evento.target.value);
          if (escolhida) onChange(escolhida.valor);
        }}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <IconeChevronBaixo className="painel-filtro__icone" />
    </label>
  );
}

export function FiltrosGlobais({ filtros, onChange }: FiltrosGlobaisProps) {
  return (
    <div className="painel-filtros" role="group" aria-label="Filtros do painel">
      <Seletor<PeriodoDias>
        rotulo="Período"
        valor={filtros.periodoDias}
        opcoes={OPCOES_PERIODO}
        onChange={(valor) => onChange('periodoDias', valor)}
      />
      <Seletor<FiltroSexo>
        rotulo="Sexo"
        valor={filtros.sexo}
        opcoes={OPCOES_SEXO}
        onChange={(valor) => onChange('sexo', valor)}
      />
      <Seletor<FiltroFaixaEtaria>
        rotulo="Faixa etária"
        valor={filtros.faixaEtaria}
        opcoes={OPCOES_FAIXA_ETARIA}
        onChange={(valor) => onChange('faixaEtaria', valor)}
      />
    </div>
  );
}
