import './dashboard/Dashboard.css';

import { AdesaoFaixaEtaria } from './dashboard/AdesaoFaixaEtaria';
import { AlertasEsforco } from './dashboard/AlertasEsforco';
import { DistribuicaoIdade } from './dashboard/DistribuicaoIdade';
import { DistribuicaoNivelEsforco } from './dashboard/DistribuicaoNivelEsforco';
import { DistribuicaoSexo } from './dashboard/DistribuicaoSexo';
import { EvolucaoPse } from './dashboard/EvolucaoPse';
import { FiltrosGlobais } from './dashboard/FiltrosGlobais';
import { GridKpis } from './dashboard/GridKpis';
import { ProgressaoNivel } from './dashboard/ProgressaoNivel';
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
          <GridKpis kpis={dados.kpis} />

          <div className="painel-grade painel-grade--principal">
            <EvolucaoPse dados={dados.evolucaoPse} />
            <AlertasEsforco dados={dados.alertasEsforco} />
          </div>

          <div className="painel-grade painel-grade--distribuicao">
            <DistribuicaoSexo dados={dados.distribuicaoSexo} />
            <DistribuicaoIdade dados={dados.distribuicaoIdade} />
            <AdesaoFaixaEtaria dados={dados.adesaoPorFaixaEtaria} />
          </div>

          <DistribuicaoNivelEsforco dados={dados.niveisEsforco} />

          <ProgressaoNivel dados={dados.progressaoNivel} />
        </div>
      )}
    </div>
  );
}
