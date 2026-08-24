import React from 'react';

import { ApiError } from '../../api/client';
import { removerExercicio } from '../../api/exercicios';
import { IconeAlerta } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import type { Exercicio } from '../../types/api';

type ModalExcluirExercicioProps = {
  exercicio: Exercicio;
  onFechar: () => void;
  onExcluido: (id: number) => void;
};

export function ModalExcluirExercicio({ exercicio, onFechar, onExcluido }: ModalExcluirExercicioProps) {
  const [excluindo, setExcluindo] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const handleExcluir = async () => {
    setErro(null);
    setExcluindo(true);
    try {
      await removerExercicio(exercicio.id);
      onExcluido(exercicio.id);
      onFechar();
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível excluir o exercício.');
      setExcluindo(false);
    }
  };

  return (
    <Modal onFechar={onFechar} largura={420}>
      <div className="modal__confirmacao">
        <div className="modal__icone-alerta">
          <IconeAlerta />
        </div>

        <h2 className="modal__titulo modal__titulo--centro">Excluir exercício</h2>
        <p className="modal__texto-centro">
          Deseja excluir o exercício <strong>{exercicio.nome}</strong>?
        </p>

        {erro ? <p className="pagina__erro">{erro}</p> : null}

        <div className="modal__rodape modal__rodape--centro">
          <button type="button" className="botao botao--contorno" onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" className="botao botao--perigo" onClick={handleExcluir} disabled={excluindo}>
            {excluindo ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
