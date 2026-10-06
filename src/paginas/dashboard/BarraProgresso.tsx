interface BarraProgressoProps {
  /** Valor de 0 a 100. */
  valor: number;
  rotulo: string;
  /** Texto exibido dentro do preenchimento (ex.: "30%"); use com `painel-barra--grossa`. */
  textoInterno?: string;
  className?: string;
}

export function BarraProgresso({ valor, rotulo, textoInterno, className }: BarraProgressoProps) {
  const limitado = Math.min(100, Math.max(0, valor));

  return (
    <div
      className={`painel-barra${className ? ` ${className}` : ''}`}
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={limitado}
    >
      <div className="painel-barra__preenchimento" style={{ width: `${limitado}%` }}>
        {textoInterno}
      </div>
    </div>
  );
}
