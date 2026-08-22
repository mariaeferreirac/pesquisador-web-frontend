import React from 'react';

import { listarExercicios } from '../api/exercicios';
import { ApiError } from '../api/client';
import type { Exercicio } from '../types/api';

export function Exercicios() {
  const [exercicios, setExercicios] = React.useState<Exercicio[] | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);

  React.useEffect(() => {
    listarExercicios()
      .then(setExercicios)
      .catch((erroCapturado) => {
        setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Erro ao carregar exercícios.');
      });
  }, []);

  return (
    <div>
      <h1>Exercícios</h1>

      <div className="cartao">
        {erro ? <p className="pagina__erro">{erro}</p> : null}
        {!erro && exercicios === null ? <p>Carregando...</p> : null}
        {exercicios && exercicios.length === 0 ? <p>Nenhum exercício cadastrado ainda.</p> : null}

        {exercicios && exercicios.length > 0 ? (
          <ul className="lista">
            {exercicios.map((exercicio) => (
              <li key={exercicio.id}>{exercicio.nome}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
