import { IconeSetaDireita, IconeSetaEsquerda } from './icones';

type PaginacaoProps = {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
};

export function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }: PaginacaoProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice + 1);

  return (
    <div className="paginacao">
      <button
        type="button"
        className="paginacao__botao"
        disabled={paginaAtual === 1}
        onClick={() => onMudarPagina(paginaAtual - 1)}
        aria-label="Página anterior"
      >
        <IconeSetaEsquerda />
      </button>

      {paginas.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`paginacao__botao${pagina === paginaAtual ? ' paginacao__botao--ativo' : ''}`}
          onClick={() => onMudarPagina(pagina)}
        >
          {pagina}
        </button>
      ))}

      <button
        type="button"
        className="paginacao__botao"
        disabled={paginaAtual === totalPaginas}
        onClick={() => onMudarPagina(paginaAtual + 1)}
        aria-label="Próxima página"
      >
        <IconeSetaDireita />
      </button>
    </div>
  );
}
