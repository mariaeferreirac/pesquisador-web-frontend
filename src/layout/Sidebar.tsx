import { NavLink } from 'react-router-dom';

import { IconeAvaliacoes, IconeChevron, IconeInstituicoes, IconeTreinos, IconeUsuarios } from './icones';

const itensEstaticos = [
  { rotulo: 'Usuários', Icone: IconeUsuarios },
  { rotulo: 'Instituições', Icone: IconeInstituicoes },
  { rotulo: 'Avaliações', Icone: IconeAvaliacoes },
];

// As páginas ficam como subitens de "Treinos".
const subItensTreinos = [
  { rota: '/exercicios', rotulo: 'Biblioteca de exercícios' },
  { rota: '/treinos', rotulo: 'Planos de Treino' },
  { rota: '/dashboard', rotulo: 'Painel de indicadores' },
  { rota: '/categorias', rotulo: 'Categorias' },
  { rota: '/participantes', rotulo: 'Participantes' },
];

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar__logo" />

      <div className="sidebar__rotulo-menu">MENU</div>

      <ul className="sidebar__lista">
        {itensEstaticos.map(({ rotulo, Icone }) => (
          <li key={rotulo}>
            <div className="sidebar__link sidebar__link--estatico">
              <Icone className="sidebar__link-icone" />
              <span className="sidebar__link-rotulo">{rotulo}</span>
              <IconeChevron className="sidebar__link-chevron" />
            </div>
          </li>
        ))}

        <li>
          <div className="sidebar__link sidebar__link--estatico">
            <IconeTreinos className="sidebar__link-icone" />
            <span className="sidebar__link-rotulo">Treinos</span>
            <IconeChevron className="sidebar__link-chevron sidebar__link-chevron--aberto" />
          </div>

          <ul className="sidebar__sublista">
            {subItensTreinos.map((item) => (
              <li key={item.rota}>
                <NavLink
                  to={item.rota}
                  className={({ isActive }) => `sidebar__sublink${isActive ? ' sidebar__sublink--ativo' : ''}`}
                >
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
