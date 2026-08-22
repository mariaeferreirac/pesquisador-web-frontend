import React from 'react';

import { listarCategorias } from '../api/categorias';
import { ApiError } from '../api/client';
import { IconeBusca, IconePlus } from '../componentes/icones';
import { Paginacao } from '../componentes/Paginacao';
import { CategoriaCard } from './categorias/CategoriaCard';
import { ModalExcluirCategoria } from './categorias/ModalExcluirCategoria';
import { ModalFormularioCategoria } from './categorias/ModalFormularioCategoria';
import type { Categoria } from '../types/api';

const ITENS_POR_PAGINA = 6;

type EstadoModal =
  | { tipo: 'nenhum' }
  | { tipo: 'criar' }
  | { tipo: 'editar'; categoria: Categoria }
  | { tipo: 'excluir'; categoria: Categoria };

export function Categorias() {
  const [categorias, setCategorias] = React.useState<Categoria[] | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [busca, setBusca] = React.useState('');
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [modal, setModal] = React.useState<EstadoModal>({ tipo: 'nenhum' });

  const carregar = React.useCallback((termoBusca: string) => {
    listarCategorias(termoBusca)
      .then(setCategorias)
      .catch((erroCapturado) => {
        setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Erro ao carregar categorias.');
      });
  }, []);

  React.useEffect(() => {
    const temporizador = setTimeout(() => {
      setPaginaAtual(1);
      carregar(busca);
    }, 300);
    return () => clearTimeout(temporizador);
  }, [busca, carregar]);

  const totalPaginas = categorias ? Math.max(1, Math.ceil(categorias.length / ITENS_POR_PAGINA)) : 1;
  const categoriasDaPagina =
    categorias?.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA) ?? [];

  return (
    <div>
      <div className="pagina__cabecalho">
        <h1>Categorias de Exercício</h1>
        <button type="button" className="botao botao--primario" onClick={() => setModal({ tipo: 'criar' })}>
          <IconePlus /> Nova Categoria
        </button>
      </div>

      <div className="busca">
        <IconeBusca className="busca__icone" />
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </div>

      {erro ? <p className="pagina__erro">{erro}</p> : null}
      {!erro && categorias === null ? <p>Carregando...</p> : null}
      {categorias && categorias.length === 0 ? <p>Nenhuma categoria encontrada.</p> : null}

      {categoriasDaPagina.length > 0 ? (
        <div className="categorias-grid">
          {categoriasDaPagina.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              categoria={categoria}
              onEditar={() => setModal({ tipo: 'editar', categoria })}
              onExcluir={() => setModal({ tipo: 'excluir', categoria })}
            />
          ))}
        </div>
      ) : null}

      <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

      {modal.tipo === 'criar' || modal.tipo === 'editar' ? (
        <ModalFormularioCategoria
          categoria={modal.tipo === 'editar' ? modal.categoria : undefined}
          onFechar={() => setModal({ tipo: 'nenhum' })}
          onSalvo={() => carregar(busca)}
        />
      ) : null}

      {modal.tipo === 'excluir' ? (
        <ModalExcluirCategoria
          categoria={modal.categoria}
          onFechar={() => setModal({ tipo: 'nenhum' })}
          onExcluida={() => carregar(busca)}
        />
      ) : null}
    </div>
  );
}
