import React from 'react';

import { listarCategorias } from '../api/categorias';
import { ApiError } from '../api/client';
import { listarExercicios } from '../api/exercicios';
import { IconeBusca, IconeLapis, IconeLixeira, IconePlay, IconePlus, IconeTag, IconeTendencia, IconeVideo } from '../componentes/icones';
import { Paginacao } from '../componentes/Paginacao';
import { BadgeCategoria } from './exercicios/BadgeCategoria';
import { FiltroCategoria } from './exercicios/FiltroCategoria';
import { ModalExcluirExercicio } from './exercicios/ModalExcluirExercicio';
import { ModalFormularioExercicio } from './exercicios/ModalFormularioExercicio';
import { ModalVisualizarVideo } from './exercicios/ModalVisualizarVideo';
import type { Categoria, Exercicio } from '../types/api';

const ITENS_POR_PAGINA = 3;

type EstadoModal =
  | { tipo: 'nenhum' }
  | { tipo: 'criar' }
  | { tipo: 'editar'; exercicio: Exercicio }
  | { tipo: 'excluir'; exercicio: Exercicio }
  | { tipo: 'assistir'; exercicio: Exercicio };

function contarNovosEsteMes(exercicios: Exercicio[]): number {
  const agora = new Date();
  return exercicios.filter((exercicio) => {
    if (!exercicio.criadoEm) {
      return false;
    }
    const data = new Date(exercicio.criadoEm);
    return data.getFullYear() === agora.getFullYear() && data.getMonth() === agora.getMonth();
  }).length;
}

export function Exercicios() {
  const [exercicios, setExercicios] = React.useState<Exercicio[] | null>(null);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [erro, setErro] = React.useState<string | null>(null);
  const [busca, setBusca] = React.useState('');
  const [categoriaId, setCategoriaId] = React.useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [modal, setModal] = React.useState<EstadoModal>({ tipo: 'nenhum' });

  React.useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => undefined);
  }, []);

  const carregar = React.useCallback((termoBusca: string, filtroCategoria: number | null) => {
    listarExercicios({ busca: termoBusca, categoriaId: filtroCategoria ?? undefined })
      .then(setExercicios)
      .catch((erroCapturado) => {
        setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Erro ao carregar exercícios.');
      });
  }, []);

  React.useEffect(() => {
    const temporizador = setTimeout(() => {
      setPaginaAtual(1);
      carregar(busca, categoriaId);
    }, 300);
    return () => clearTimeout(temporizador);
  }, [busca, categoriaId, carregar]);

  const categoriaPorId = React.useMemo(() => {
    const mapa = new Map<number, Categoria>();
    categorias.forEach((categoria) => mapa.set(categoria.id, categoria));
    return mapa;
  }, [categorias]);

  const totalExercicios = exercicios?.length ?? 0;
  const totalPaginas = exercicios ? Math.max(1, Math.ceil(exercicios.length / ITENS_POR_PAGINA)) : 1;

  React.useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const exerciciosDaPagina =
    exercicios?.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA) ?? [];

  return (
    <div>
      <div className="pagina__cabecalho">
        <h1>Biblioteca de Exercícios</h1>
        <button type="button" className="botao botao--primario" onClick={() => setModal({ tipo: 'criar' })}>
          <IconePlus /> Cadastrar Exercício
        </button>
      </div>

      <div className="cartao">
        <div className="pagina__filtros">
          <div className="busca busca--sem-margem">
            <IconeBusca className="busca__icone" />
            <input
              type="text"
              placeholder="Buscar por nome do exercício"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <FiltroCategoria categorias={categorias} categoriaId={categoriaId} onMudar={setCategoriaId} />

          <span className="pagina__contagem">
            Exibindo {exerciciosDaPagina.length} de {totalExercicios} exercícios
          </span>
        </div>

        {erro ? <p className="pagina__erro">{erro}</p> : null}
        {!erro && exercicios === null ? <p>Carregando...</p> : null}
        {exercicios && exercicios.length === 0 ? <p>Nenhum exercício encontrado.</p> : null}

        {exerciciosDaPagina.length > 0 ? (
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Miniatura</th>
                  <th>Nome do Exercício</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {exerciciosDaPagina.map((exercicio) => {
                  const categoria = categoriaPorId.get(exercicio.categoriaId);
                  return (
                    <tr key={exercicio.id}>
                      <td>
                        <button
                          type="button"
                          className="exercicio-miniatura"
                          onClick={() => setModal({ tipo: 'assistir', exercicio })}
                          aria-label={`Assistir vídeo de ${exercicio.nome}`}
                        >
                          <IconePlay />
                        </button>
                      </td>
                      <td>{exercicio.nome}</td>
                      <td>
                        {categoria ? (
                          <BadgeCategoria nome={categoria.nome} categoriaId={categoria.id} />
                        ) : (
                          <span className="pagina__texto-secundario">—</span>
                        )}
                      </td>
                      <td className="tabela__acoes">
                        <button type="button" onClick={() => setModal({ tipo: 'editar', exercicio })} aria-label={`Editar ${exercicio.nome}`}>
                          <IconeLapis />
                        </button>
                        <button type="button" onClick={() => setModal({ tipo: 'excluir', exercicio })} aria-label={`Excluir ${exercicio.nome}`}>
                          <IconeLixeira />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="tabela__rodape">
          <span className="pagina__texto-secundario">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />
        </div>
      </div>

      <div className="cartoes-resumo">
        <div className="cartao-resumo">
          <div className="cartao-resumo__icone cartao-resumo__icone--azul">
            <IconeVideo />
          </div>
          <div>
            <div className="cartao-resumo__numero">{totalExercicios}</div>
            <div className="cartao-resumo__rotulo">Vídeos na Biblioteca</div>
          </div>
        </div>

        <div className="cartao-resumo">
          <div className="cartao-resumo__icone cartao-resumo__icone--laranja">
            <IconeTag />
          </div>
          <div>
            <div className="cartao-resumo__numero">{categorias.length}</div>
            <div className="cartao-resumo__rotulo">Categorias</div>
          </div>
        </div>

        <div className="cartao-resumo">
          <div className="cartao-resumo__icone cartao-resumo__icone--verde">
            <IconeTendencia />
          </div>
          <div>
            <div className="cartao-resumo__numero">+{contarNovosEsteMes(exercicios ?? [])}</div>
            <div className="cartao-resumo__rotulo">Novos este mês</div>
          </div>
        </div>
      </div>

      {modal.tipo === 'criar' || modal.tipo === 'editar' ? (
        <ModalFormularioExercicio
          exercicio={modal.tipo === 'editar' ? modal.exercicio : undefined}
          categorias={categorias}
          onFechar={() => setModal({ tipo: 'nenhum' })}
          onSalvo={() => carregar(busca, categoriaId)}
        />
      ) : null}

      {modal.tipo === 'excluir' ? (
        <ModalExcluirExercicio
          exercicio={modal.exercicio}
          onFechar={() => setModal({ tipo: 'nenhum' })}
          onExcluido={() => carregar(busca, categoriaId)}
        />
      ) : null}

      {modal.tipo === 'assistir' ? (
        <ModalVisualizarVideo exercicio={modal.exercicio} onFechar={() => setModal({ tipo: 'nenhum' })} />
      ) : null}
    </div>
  );
}
