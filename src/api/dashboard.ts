import { buscarDashboardMock } from '../paginas/dashboard/dashboard.mock';
import type { DashboardDados, FiltrosDashboard } from '../paginas/dashboard/dashboard.mock';

/**
 * Ponto único de acesso aos dados do Painel de indicadores (equivale ao futuro
 * `DashboardService`).
 *
 * Hoje devolve o mock. Para integrar com o backend, troque o corpo por:
 *
 *   const parametros = new URLSearchParams({
 *     periodoDias: String(filtros.periodoDias),
 *     sexo: filtros.sexo,
 *     faixaEtaria: filtros.faixaEtaria,
 *   });
 *   return apiRequest<DashboardDados>(`/dashboard?${parametros}`);
 *
 * (importando `apiRequest` de './client'). Componentes e hook não mudam.
 */
export function buscarDashboard(filtros: FiltrosDashboard): Promise<DashboardDados> {
  return buscarDashboardMock(filtros);
}
