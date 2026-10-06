const formatadorInteiro = new Intl.NumberFormat('pt-BR');
const formatadorDecimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatarInteiro(valor: number): string {
  return formatadorInteiro.format(valor);
}

export function formatarDecimal(valor: number): string {
  return formatadorDecimal.format(valor);
}

export function formatarPercentual(valor: number): string {
  return `${formatarInteiro(Math.round(valor))}%`;
}

/** Porcentagem inteira de `parte` sobre `total` (0 quando o total é 0). */
export function calcularPercentual(parte: number, total: number): number {
  return total > 0 ? Math.round((parte / total) * 100) : 0;
}

/** Ex.: +12, −3 (usa o sinal de menos tipográfico). */
export function formatarComSinal(valor: number): string {
  if (valor > 0) return `+${formatarInteiro(valor)}`;
  if (valor < 0) return `−${formatarInteiro(Math.abs(valor))}`;
  return '0';
}
