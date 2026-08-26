import { Modal } from '../../componentes/Modal';

type ModalSucessoTreinoProps = {
  mensagem: string;
  onFechar: () => void;
};

function IconeCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10.5 8 14.5 16 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ModalSucessoTreino({ mensagem, onFechar }: ModalSucessoTreinoProps) {
  return (
    <Modal onFechar={onFechar} largura={380}>
      <div className="modal__confirmacao">
        <div className="modal__icone-alerta modal__icone-alerta--sucesso">
          <IconeCheck />
        </div>

        <h2 className="modal__titulo modal__titulo--centro">Sucesso!</h2>
        <p className="modal__texto-centro">{mensagem}</p>

        <div className="modal__rodape modal__rodape--centro">
          <button type="button" className="botao botao--primario" onClick={onFechar}>
            Ok, entendi
          </button>
        </div>
      </div>
    </Modal>
  );
}
