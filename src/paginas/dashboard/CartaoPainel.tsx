import { useId } from 'react';
import type { ReactNode } from 'react';

interface CartaoPainelProps {
  titulo: string;
  /** Conteúdo à direita do título (ex.: legenda, link "Ver todos"). */
  acao?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function CartaoPainel({ titulo, acao, className, children }: CartaoPainelProps) {
  const idTitulo = useId();

  return (
    <section className={`painel-cartao${className ? ` ${className}` : ''}`} aria-labelledby={idTitulo}>
      <header className="painel-cartao__cabecalho">
        <h2 id={idTitulo} className="painel-cartao__titulo">
          {titulo}
        </h2>
        {acao}
      </header>
      {children}
    </section>
  );
}
