import React from 'react';

import { listarCategorias } from '../api/categorias';
import { ApiError } from '../api/client';
import type { Categoria } from '../types/api';

export function Categorias() {
  const [categorias, setCategorias] = React.useState<Categoria[] | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);

  React.useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch((erroCapturado) => {
        setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Erro ao carregar categorias.');
      });
  }, []);

  return (
    <div>
      <h1>Categorias</h1>

      <div className="cartao">
        {erro ? <p className="pagina__erro">{erro}</p> : null}
        {!erro && categorias === null ? <p>Carregando...</p> : null}
        {categorias && categorias.length === 0 ? <p>Nenhuma categoria cadastrada ainda.</p> : null}

        {categorias && categorias.length > 0 ? (
          <ul className="lista">
            {categorias.map((categoria) => (
              <li key={categoria.id}>{categoria.nome}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
