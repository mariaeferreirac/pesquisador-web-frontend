import React from 'react';

import { ApiError } from '../../api/client';
import { removerCategoria } from '../../api/categorias';
import { IconeAlerta } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import type { Categoria } from '../../types/api';

type ModalExcluirCategoriaProps = {
  categoria: Categoria;
  onFechar: () => void;
  onExcluida: (id: number) => void;
};

export function ModalExcluirCategoria({ categoria, onFechar, onExcluida }: ModalExcluirCategoriaProps) {
  const [excluindo, setExcluindo] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const handleExcluir = async () => {
    setErro(null);
    setExcluindo(true);
    try {
      await removerCategoria(categoria.id);
      onExcluida(categoria.id);
      onFechar();
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível excluir a categoria.');
      setExcluindo(false);
    }
  };

  return (
    <Modal onFechar={onFechar} largura={420}>
      <div className="modal__confirmacao">
        <div className="modal__icone-alerta">
          <IconeAlerta />
        </div>

        <h2 className="modal__titulo modal__titulo--centro">Excluir categoria</h2>
        <p className="modal__texto-centro">
          Deseja excluir a categoria <strong>{categoria.nome}</strong>?
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
