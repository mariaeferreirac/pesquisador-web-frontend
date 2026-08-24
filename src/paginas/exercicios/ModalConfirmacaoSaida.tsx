import { IconeAlerta } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';

type ModalConfirmacaoSaidaProps = {
  onVoltar: () => void;
  onSair: () => void;
};

export function ModalConfirmacaoSaida({ onVoltar, onSair }: ModalConfirmacaoSaidaProps) {
  return (
    <Modal onFechar={onVoltar} largura={380}>
      <div className="modal__confirmacao">
        <div className="modal__icone-alerta modal__icone-alerta--aviso">
          <IconeAlerta />
        </div>

        <h2 className="modal__titulo modal__titulo--centro">Confirmação de Saída</h2>
        <p className="modal__texto-centro">Deseja sair sem salvar as alterações?</p>

        <div className="modal__rodape modal__rodape--centro">
          <button type="button" className="botao botao--contorno" onClick={onVoltar}>
            Voltar
          </button>
          <button type="button" className="botao botao--perigo" onClick={onSair}>
            Sair
          </button>
        </div>
      </div>
    </Modal>
  );
}
