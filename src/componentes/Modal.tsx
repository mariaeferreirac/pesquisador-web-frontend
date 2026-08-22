import type { ReactNode } from 'react';

type ModalProps = {
  onFechar: () => void;
  children: ReactNode;
  largura?: number;
};

// Cda modal específico monta seu próprio cabeçalho/corpo/rodapé por dentro, já que os designs variam bastante
export function Modal({ onFechar, children, largura = 480 }: ModalProps) {
  return (
    <div className="modal__overlay" onClick={onFechar}>
      <div className="modal__cartao" style={{ maxWidth: largura }} onClick={(evento) => evento.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
