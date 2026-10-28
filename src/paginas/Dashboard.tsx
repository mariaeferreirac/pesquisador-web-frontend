import './dashboard/Dashboard.css';

import { AdesaoFaixaEtaria } from './dashboard/AdesaoFaixaEtaria';
import { AlertasEsforco } from './dashboard/AlertasEsforco';
import { DistribuicaoFase } from './dashboard/DistribuicaoFase';
import { DistribuicaoFaseEsforco } from './dashboard/DistribuicaoFaseEsforco';
import { DistribuicaoIdade } from './dashboard/DistribuicaoIdade';
import { DistribuicaoSexo } from './dashboard/DistribuicaoSexo';
import { EvolucaoPse } from './dashboard/EvolucaoPse';
import { FiltrosGlobais } from './dashboard/FiltrosGlobais';
import { GridKpis } from './dashboard/GridKpis';
import { ProgressaoFase } from './dashboard/ProgressaoFase';
import { useDashboard } from './dashboard/useDashboard';

export function Dashboard() {
  const { filtros, atualizarFiltro, dados, carregando, erro } = useDashboard();

  return (
    <div className="painel">
      <header className="painel__cabecalho">
        <div>
          <h1 className="painel__titulo">Painel de indicadores</h1>
          <p className="painel__subtitulo">
            Visão geral de engajamento, esforço e progressão dos participantes.
          </p>
        </div>
        <FiltrosGlobais filtros={filtros} onChange={atualizarFiltro} />
      </header>

      {erro && (
        <p className="pagina__erro" role="alert">
          {erro}
        </p>
      )}

      {!dados && carregando && (
        <p className="painel__status" role="status">
          Carregando indicadores…
        </p>
      )}

      {dados && (
        <div className={`painel__conteudo${carregando ? ' painel__conteudo--atualizando' : ''}`} aria-busy={carregando}>
          <GridKpis kpis={dados.kpis} periodoDias={filtros.periodoDias} />

          <div className="painel-grade painel-grade--principal">
            <EvolucaoPse dados={dados.evolucaoPse} />
            <AlertasEsforco dados={dados.alertasEsforco} />
          </div>

          {/* Fase: pizza da distribuição geral + progressão no período. */}
          <div className="painel-grade painel-grade--secundaria">
            <DistribuicaoFase dados={dados.fasesEsforco} />
            <ProgressaoFase dados={dados.progressaoFase} />
          </div>

          {/* Esforço dentro de cada fase (faixas OMNI) — detalhamento complementar à pizza. */}
          <DistribuicaoFaseEsforco dados={dados.fasesEsforco} />

          {/* Distribuições demográficas: mudam pouco, ficam por último. */}
          <div className="painel-grade painel-grade--distribuicao">
            <DistribuicaoSexo dados={dados.distribuicaoSexo} />
            <DistribuicaoIdade dados={dados.distribuicaoIdade} />
            <AdesaoFaixaEtaria dados={dados.adesaoPorFaixaEtaria} />
          </div>
        </div>
      )}
    </div>
  );
}
