import { useEffect, useRef, useState } from 'react';

import { IconeInfo } from '../../componentes/icones';

/**
 * Ícone "i" clicável que mostra um balão explicativo sobre a métrica do card ao lado.
 * Fecha ao clicar fora, pressionar Esc ou clicar no próprio ícone de novo.
 */
export function DicaInfo({ texto }: { texto: string }) {
  const [aberta, setAberta] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!aberta) return;

    function aoClicarFora(evento: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setAberta(false);
      }
    }
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAberta(false);
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoPressionarTecla);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoPressionarTecla);
    };
  }, [aberta]);

  return (
    <span className="dica-info" ref={containerRef}>
      <button
        type="button"
        className="dica-info__botao"
        onClick={() => setAberta((atual) => !atual)}
        aria-expanded={aberta}
        aria-label="Mais informações sobre este indicador"
      >
        <IconeInfo />
      </button>
      {aberta ? (
        <span className="dica-info__balao" role="tooltip">
          {texto}
        </span>
      ) : null}
    </span>
  );
}
