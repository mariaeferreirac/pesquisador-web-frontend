const QUANTIDADE_CORES = 6;

type BadgeCategoriaProps = {
  nome: string;
  categoriaId: number;
};

export function BadgeCategoria({ nome, categoriaId }: BadgeCategoriaProps) {
  const indiceCor = ((categoriaId % QUANTIDADE_CORES) + QUANTIDADE_CORES) % QUANTIDADE_CORES;
  return <span className={`badge badge--${indiceCor}`}>{nome}</span>;
}
