import { useEffect, useState } from 'react';

import { buscarDashboard } from '../../api/dashboard';
import { FILTROS_PADRAO } from './dashboard.mock';
import type { DashboardDados, FiltrosDashboard } from './dashboard.mock';

interface Resultado {
  /** Filtros que originaram este resultado. */
  filtros: FiltrosDashboard;
  dados: DashboardDados | null;
  erro: string | null;
}

export function useDashboard() {
  const [filtros, setFiltros] = useState<FiltrosDashboard>(FILTROS_PADRAO);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    // Evita que uma resposta antiga sobrescreva a de um filtro mais recente.
    let cancelado = false;

    buscarDashboard(filtros)
      .then((dados) => {
        if (!cancelado) setResultado({ filtros, dados, erro: null });
      })
      .catch((erro: unknown) => {
        if (cancelado) return;
        const mensagem = erro instanceof Error ? erro.message : 'Não foi possível carregar o painel.';
        // Mantém os últimos dados válidos na tela e apenas sinaliza o erro.
        setResultado((atual) => ({ filtros, dados: atual?.dados ?? null, erro: mensagem }));
      });

    return () => {
      cancelado = true;
    };
  }, [filtros]);

  function atualizarFiltro<K extends keyof FiltrosDashboard>(chave: K, valor: FiltrosDashboard[K]) {
    setFiltros((atual) => ({ ...atual, [chave]: valor }));
  }

  return {
    filtros,
    atualizarFiltro,
    dados: resultado?.dados ?? null,
    erro: resultado?.erro ?? null,
    // Carregando enquanto o último resultado não corresponde aos filtros atuais.
    carregando: resultado?.filtros !== filtros,
  };
}
