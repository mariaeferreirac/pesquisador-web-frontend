import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { LayoutPrincipal } from './layout/LayoutPrincipal';
import { Categorias } from './paginas/Categorias';
import { Dashboard } from './paginas/Dashboard';
import { Exercicios } from './paginas/Exercicios';
import { Participantes } from './paginas/Participantes';
import { Treinos } from './paginas/Treinos';
import { TreinoFormulario } from './paginas/treinos/TreinoFormulario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPrincipal />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exercicios" element={<Exercicios />} />
          <Route path="/treinos" element={<Treinos />} />
          <Route path="/treinos/novo" element={<TreinoFormulario modo="criar" />} />
          <Route path="/treinos/:id/editar" element={<TreinoFormulario modo="editar" />} />
          <Route path="/treinos/:id" element={<TreinoFormulario modo="visualizar" />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/participantes" element={<Participantes />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
