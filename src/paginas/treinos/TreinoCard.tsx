import { IconeLapis, IconeLixeira } from '../../componentes/icones';
import type { TreinoResumo } from '../../types/api';

type TreinoCardProps = {
  treino: TreinoResumo;
  onVisualizar: () => void;
  onEditar: () => void;
  onExcluir: () => void;
};

const CLASSE_POR_FASE: Record<TreinoResumo['fase'], string> = {
  Iniciante: 'badge-fase badge-fase--iniciante',
  Intermediário: 'badge-fase badge-fase--intermediario',
  Avançado: 'badge-fase badge-fase--avancado',
};

function IconeRelogio() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TreinoCard({ treino, onVisualizar, onEditar, onExcluir }: TreinoCardProps) {
  return (
    <div
      className="treino-card"
      role="button"
      tabIndex={0}
      onClick={onVisualizar}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          onVisualizar();
        }
      }}
      aria-label={`Visualizar ${treino.nome}`}
    >
      <div className="treino-card__topo">
        <span className="treino-card__duracao">
          <IconeRelogio /> {treino.duracaoEstimadaMinutos} min
        </span>
        <span className={CLASSE_POR_FASE[treino.fase]}>{treino.fase.toUpperCase()}</span>
      </div>

      <h3 className="treino-card__nome">{treino.nome}</h3>
      <span className="treino-card__nivel">Nível {treino.nivel}</span>

      <div className="treino-card__acoes">
        <button
          type="button"
          onClick={(evento) => {
            evento.stopPropagation();
            onEditar();
          }}
          aria-label={`Editar ${treino.nome}`}
        >
          <IconeLapis />
        </button>
        <button
          type="button"
          onClick={(evento) => {
            evento.stopPropagation();
            onExcluir();
          }}
          aria-label={`Excluir ${treino.nome}`}
        >
          <IconeLixeira />
        </button>
      </div>
    </div>
  );
}
