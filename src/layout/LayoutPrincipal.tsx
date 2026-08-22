import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';

export function LayoutPrincipal() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__conteudo">
        <main className="layout__pagina">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
