import type { ReactNode } from 'react';

type LayoutAutenticacaoProps = {
  children: ReactNode;
};

export function LayoutAutenticacao({ children }: LayoutAutenticacaoProps) {
  return (
    <div className="login">
      <aside className="login__painel">
        <h1 className="login__painel-titulo">Área do Pesquisador</h1>
        <p className="login__painel-texto">
          Gerencie exercícios, planos de treino e acompanhe os indicadores dos participantes.
        </p>
      </aside>

      <main className="login__conteudo">{children}</main>
    </div>
  );
}
