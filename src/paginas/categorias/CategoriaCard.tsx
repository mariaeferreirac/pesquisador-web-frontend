import { IconeLapis, IconeLixeira } from '../../componentes/icones';
import type { Categoria } from '../../types/api';

type CategoriaCardProps = {
  categoria: Categoria;
  onEditar: () => void;
  onExcluir: () => void;
};

export function CategoriaCard({ categoria, onEditar, onExcluir }: CategoriaCardProps) {
  return (
    <div className="categoria-card">
      <span className="categoria-card__nome">{categoria.nome}</span>
      <div className="categoria-card__divisor" />
      <div className="categoria-card__acoes">
        <button type="button" onClick={onEditar} aria-label={`Editar ${categoria.nome}`}>
          <IconeLapis />
        </button>
        <button type="button" onClick={onExcluir} aria-label={`Excluir ${categoria.nome}`}>
          <IconeLixeira />
        </button>
      </div>
    </div>
  );
}
