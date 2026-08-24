import React from 'react';

import { IconeChevronBaixo } from '../../componentes/icones';
import type { Categoria } from '../../types/api';

type FiltroCategoriaProps = {
  categorias: Categoria[];
  categoriaId: number | null;
  onMudar: (categoriaId: number | null) => void;
};

export function FiltroCategoria({ categorias, categoriaId, onMudar }: FiltroCategoriaProps) {
  const [aberto, setAberto] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!aberto) {
      return;
    }
    const handleClickFora = (evento: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [aberto]);

  const categoriaSelecionada = categorias.find((categoria) => categoria.id === categoriaId);

  return (
    <div className="filtro-categoria" ref={containerRef}>
      <button type="button" className="filtro-categoria__botao" onClick={() => setAberto((valor) => !valor)}>
        {categoriaSelecionada ? categoriaSelecionada.nome : 'Categoria'}
        <IconeChevronBaixo />
      </button>

      {aberto ? (
        <div className="filtro-categoria__menu">
          <button
            type="button"
            className={`filtro-categoria__item${categoriaId === null ? ' filtro-categoria__item--ativo' : ''}`}
            onClick={() => {
              onMudar(null);
              setAberto(false);
            }}
          >
            Todas as categorias
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              className={`filtro-categoria__item${categoria.id === categoriaId ? ' filtro-categoria__item--ativo' : ''}`}
              onClick={() => {
                onMudar(categoria.id);
                setAberto(false);
              }}
            >
              {categoria.nome}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
