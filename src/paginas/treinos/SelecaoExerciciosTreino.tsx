import React from 'react';

import { IconeBusca, IconePlay, IconeSetaEsquerda } from '../../componentes/icones';
import { BadgeCategoria } from '../exercicios/BadgeCategoria';
import { ModalVisualizarVideo } from '../exercicios/ModalVisualizarVideo';
import type { Categoria, Exercicio } from '../../types/api';

const ITENS_POR_PAGINA = 6;

type SelecaoExerciciosTreinoProps = {
  exerciciosDisponiveis: Exercicio[];
  categorias: Categoria[];
  idsJaVinculados: number[];
  onVoltar: () => void;
  onConfirmar: (exerciciosSelecionados: Exercicio[]) => void;
};

/**
 * Tela cheia de seleção de exercícios (não é modal) — acessada a partir do
 * formulário de treino, mantém o sidebar visível e volta com a seta "←",
 * igual ao fluxo definido no Figma.
 */
export function SelecaoExerciciosTreino({
  exerciciosDisponiveis,
  categorias,
  idsJaVinculados,
  onVoltar,
  onConfirmar,
}: SelecaoExerciciosTreinoProps) {
  const [busca, setBusca] = React.useState('');
  const [categoriaId, setCategoriaId] = React.useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [selecionados, setSelecionados] = React.useState<Map<number, Exercicio>>(new Map());
  const [assistindo, setAssistindo] = React.useState<Exercicio | null>(null);

  React.useEffect(() => {
    setPaginaAtual(1);
  }, [busca, categoriaId]);

  const categoriaPorId = React.useMemo(() => {
    const mapa = new Map<number, Categoria>();
    categorias.forEach((categoria) => mapa.set(categoria.id, categoria));
    return mapa;
  }, [categorias]);

  const exerciciosFiltrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return exerciciosDisponiveis.filter((exercicio) => {
      if (categoriaId !== null && exercicio.categoriaId !== categoriaId) return false;
      if (termo && !exercicio.nome.toLowerCase().includes(termo)) return false;
      return true;
    });
  }, [exerciciosDisponiveis, busca, categoriaId]);

  const totalExercicios = exerciciosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalExercicios / ITENS_POR_PAGINA));
  const exerciciosDaPagina = exerciciosFiltrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA,
  );

  function alternarSelecao(exercicio: Exercicio) {
    setSelecionados((atual) => {
      const proximo = new Map(atual);
      if (proximo.has(exercicio.id)) {
        proximo.delete(exercicio.id);
      } else {
        proximo.set(exercicio.id, exercicio);
      }
      return proximo;
    });
  }

  const quantidadeSelecionada = selecionados.size;

  return (
    <div className="selecao-exercicios-treino">
      <div className="pagina__cabecalho">
        <div className="pagina__titulo-com-voltar">
          <button type="button" className="botao-icone" onClick={onVoltar} aria-label="Voltar">
            <IconeSetaEsquerda />
          </button>
          <h1>Selecionar Exercícios</h1>
        </div>
      </div>

      <div className="cartao">
        <div className="pagina__filtros">
          <div className="busca busca--sem-margem">
            <IconeBusca className="busca__icone" />
            <input
              type="search"
              placeholder="Buscar por nome do exercício..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>
          <select
            className="filtro-fase"
            value={categoriaId ?? ''}
            onChange={(evento) => setCategoriaId(evento.target.value ? Number(evento.target.value) : null)}
          >
            <option value="">Categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          <span className="pagina__contagem">
            {totalExercicios > 0
              ? `Exibindo ${exerciciosDaPagina.length} de ${totalExercicios} exercícios`
              : 'Nenhum exercício encontrado'}
          </span>
        </div>

        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Miniatura</th>
                <th>Nome do Exercício</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {exerciciosDaPagina.map((exercicio) => {
                const jaVinculado = idsJaVinculados.includes(exercicio.id);
                const categoria = categoriaPorId.get(exercicio.categoriaId);
                return (
                  <tr key={exercicio.id}>
                    <td>
                      <button
                        type="button"
                        className="exercicio-miniatura"
                        onClick={() => setAssistindo(exercicio)}
                        aria-label={`Assistir vídeo de ${exercicio.nome}`}
                      >
                        <IconePlay />
                      </button>
                    </td>
                    <td>{exercicio.nome}</td>
                    <td>
                      {categoria ? (
                        <BadgeCategoria nome={categoria.nome} categoriaId={categoria.id} />
                      ) : (
                        <span className="pagina__texto-secundario">—</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selecionados.has(exercicio.id) || jaVinculado}
                        disabled={jaVinculado}
                        onChange={() => alternarSelecao(exercicio)}
                        aria-label={`Selecionar ${exercicio.nome}`}
                        title={jaVinculado ? 'Já vinculado a este treino' : undefined}
                      />
                    </td>
                  </tr>
                );
              })}
              {exerciciosDaPagina.length === 0 ? (
                <tr>
                  <td colSpan={4} className="pagina__texto-secundario">
                    Nenhum exercício encontrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="modal-selecao-exercicios__paginacao">
          <button type="button" disabled={paginaAtual <= 1} onClick={() => setPaginaAtual((p) => p - 1)}>
            ‹
          </button>
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            type="button"
            disabled={paginaAtual >= totalPaginas}
            onClick={() => setPaginaAtual((p) => p + 1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="selecao-exercicios-treino__rodape">
        <span>
          <strong>{quantidadeSelecionada}</strong> exercício{quantidadeSelecionada === 1 ? '' : 's'}{' '}
          selecionado{quantidadeSelecionada === 1 ? '' : 's'} para este treino
        </span>
        <div className="modal-selecao-exercicios__rodape-acoes">
          <button type="button" className="botao botao--contorno" onClick={onVoltar}>
            Cancelar
          </button>
          <button
            type="button"
            className="botao botao--primario"
            disabled={quantidadeSelecionada === 0}
            onClick={() => onConfirmar(Array.from(selecionados.values()))}
          >
            Confirmar Seleção
          </button>
        </div>
      </div>

      {assistindo ? <ModalVisualizarVideo exercicio={assistindo} onFechar={() => setAssistindo(null)} /> : null}
    </div>
  );
}
