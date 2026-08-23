import { IconeFechar } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import type { Exercicio } from '../../types/api';

type ModalVisualizarVideoProps = {
  exercicio: Exercicio;
  onFechar: () => void;
};

export function ModalVisualizarVideo({ exercicio, onFechar }: ModalVisualizarVideoProps) {
  return (
    <Modal onFechar={onFechar} largura={640}>
      <div className="modal__cabecalho">
        <h2 className="modal__titulo">{exercicio.nome}</h2>
        <button type="button" className="modal__fechar" onClick={onFechar} aria-label="Fechar">
          <IconeFechar />
        </button>
      </div>

      <div className="modal__corpo">
        <video className="video-player" src={exercicio.videoUrl} controls autoPlay />

        {exercicio.instrucao.length > 0 ? (
          <ul className="video-player__instrucoes">
            {exercicio.instrucao.map((linha, indice) => (
              <li key={indice}>{linha}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </Modal>
  );
}
