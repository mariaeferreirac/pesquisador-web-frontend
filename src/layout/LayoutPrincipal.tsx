import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { obterSessao } from '../api/autenticacao';
import { Sidebar } from './Sidebar';

export function LayoutPrincipal() {
  const location = useLocation();
  const pesquisador = obterSessao();

  // Sem sessão, qualquer página interna leva ao login, que devolve para cá depois de entrar.
  if (!pesquisador) {
    return <Navigate to="/login" replace state={{ origem: location.pathname + location.search }} />;
  }

  return (
    <div className="layout">
      <Sidebar pesquisador={pesquisador} />
      <div className="layout__conteudo">
        <main className="layout__pagina">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
