import React from 'react';

import { listarTreinos } from '../api/treinos';
import { ApiError } from '../api/client';
import type { Treino } from '../types/api';

export function Treinos() {
  const [treinos, setTreinos] = React.useState<Treino[] | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);

  React.useEffect(() => {
    listarTreinos()
      .then(setTreinos)
      .catch((erroCapturado) => {
        setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Erro ao carregar treinos.');
      });
  }, []);

  return (
    <div>
      <h1>Treinos</h1>

      <div className="cartao">
        {erro ? <p className="pagina__erro">{erro}</p> : null}
        {!erro && treinos === null ? <p>Carregando...</p> : null}
        {treinos && treinos.length === 0 ? <p>Nenhum treino cadastrado ainda.</p> : null}

        {treinos && treinos.length > 0 ? (
          <ul className="lista">
            {treinos.map((treino) => (
              <li key={treino.id}>{treino.nome}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
