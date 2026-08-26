import React from 'react';

import { ApiError } from '../../api/client';
import { removerTreino } from '../../api/treinos';
import { IconeAlerta } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import type { TreinoResumo } from '../../types/api';

type ModalExcluirTreinoProps = {
  treino: TreinoResumo;
  onFechar: () => void;
  onExcluido: () => void;
};

export function ModalExcluirTreino({ treino, onFechar, onExcluido }: ModalExcluirTreinoProps) {
  const [excluindo, setExcluindo] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const handleExcluir = async () => {
    setErro(null);
    setExcluindo(true);
    try {
      await removerTreino(treino.id);
      onExcluido();
      onFechar();
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível excluir o treino.');
      setExcluindo(false);
    }
  };

  return (
    <Modal onFechar={onFechar} largura={420}>
      <div className="modal__confirmacao">
        <div className="modal__icone-alerta">
          <IconeAlerta />
        </div>

        <h2 className="modal__titulo modal__titulo--centro">Excluir treino</h2>
        <p className="modal__texto-centro">
          Deseja excluir o treino <strong>{treino.nome}</strong>?
        </p>

        {erro ? <p className="pagina__erro">{erro}</p> : null}

        <div className="modal__rodape modal__rodape--centro">
          <button type="button" className="botao botao--contorno" onClick={onFechar} disabled={excluindo}>
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
