import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../EstilosTreinos.css';
import { ApiError } from '../api/client';
import { listarTreinos } from '../api/treinos';
import { IconeBusca, IconePlus } from '../componentes/icones';
import { Paginacao } from '../componentes/Paginacao';
import { ModalExcluirTreino } from './treinos/ModalExcluirTreino';
import { TreinoCard } from './treinos/TreinoCard';
import type { FaseTreino, TreinoResumo } from '../types/api';

const ITENS_POR_PAGINA = 6;
const FASES: FaseTreino[] = ['Iniciante', 'Intermediário', 'Avançado'];

export function Treinos() {
  const navigate = useNavigate();
  const [treinos, setTreinos] = React.useState<TreinoResumo[] | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [busca, setBusca] = React.useState('');
  const [fase, setFase] = React.useState<FaseTreino | ''>('');
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [treinoParaExcluir, setTreinoParaExcluir] = React.useState<TreinoResumo | null>(null);

  const carregar = React.useCallback((termoBusca: string, filtroFase: FaseTreino | '') => {
    listarTreinos({ busca: termoBusca, fase: filtroFase || undefined })
      .then(setTreinos)
      .catch((erroCapturado) => {
        setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Erro ao carregar treinos.');
      });
  }, []);

  React.useEffect(() => {
    const temporizador = setTimeout(() => {
      setPaginaAtual(1);
      carregar(busca, fase);
    }, 300);
    return () => clearTimeout(temporizador);
  }, [busca, fase, carregar]);

  const totalPaginas = treinos ? Math.max(1, Math.ceil(treinos.length / ITENS_POR_PAGINA)) : 1;

  React.useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const treinosDaPagina =
    treinos?.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA) ?? [];

  const recarregar = () => carregar(busca, fase);

  return (
    <div>
      <div className="pagina__cabecalho">
        <h1>Planos de Treino</h1>
        <button type="button" className="botao botao--primario" onClick={() => navigate('/treinos/novo')}>
          <IconePlus /> Novo Treino
        </button>
      </div>

      <div className="pagina__filtros">
        <div className="busca busca--sem-margem">
          <IconeBusca className="busca__icone" />
          <input
            type="text"
            placeholder="Buscar por nome do treino"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <select
          className="filtro-fase"
          value={fase}
          onChange={(evento) => setFase(evento.target.value as FaseTreino | '')}
        >
          <option value="">Filtrar por Fase</option>
          {FASES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <span className="pagina__contagem">
          Exibindo {treinosDaPagina.length} de {treinos?.length ?? 0} treinos
        </span>
      </div>

      {erro ? <p className="pagina__erro">{erro}</p> : null}
      {!erro && treinos === null ? <p>Carregando...</p> : null}
      {treinos && treinos.length === 0 ? <p>Nenhum treino encontrado.</p> : null}

      {treinosDaPagina.length > 0 ? (
        <div className="treinos-grid">
          {treinosDaPagina.map((treino) => (
            <TreinoCard
              key={treino.id}
              treino={treino}
              onVisualizar={() => navigate(`/treinos/${treino.id}`)}
              onEditar={() => navigate(`/treinos/${treino.id}/editar`)}
              onExcluir={() => setTreinoParaExcluir(treino)}
            />
          ))}
        </div>
      ) : null}

      <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

      {treinoParaExcluir ? (
        <ModalExcluirTreino
          treino={treinoParaExcluir}
          onFechar={() => setTreinoParaExcluir(null)}
          onExcluido={recarregar}
        />
      ) : null}
    </div>
  );
}
