import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../EstilosTreinos.css';
import { ApiError } from '../../api/client';
import { listarCategorias } from '../../api/categorias';
import { listarExercicios } from '../../api/exercicios';
import { atualizarTreino, buscarTreino, criarTreino } from '../../api/treinos';
import { IconeLixeira } from '../../componentes/icones';
import { ModalConfirmacaoSaida } from '../exercicios/ModalConfirmacaoSaida';
import { ModalSucessoTreino } from './ModalSucessoTreino';
import { SelecaoExerciciosTreino } from './SelecaoExerciciosTreino';
import type {
  Categoria,
  Exercicio,
  ExercicioVinculado,
  ExercicioVinculadoDetalhado,
  FaseTreino,
  NivelTreino,
  TreinoCriarRequest,
  TreinoDetalhe,
} from '../../types/api';

export type ModoFormularioTreino = 'criar' | 'editar' | 'visualizar';

type TreinoFormularioProps = {
  modo: ModoFormularioTreino;
};

const NIVEIS: NivelTreino[] = [1, 2];
const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5];

/**
 * Tela cheia (não é modal) de criação/edição/visualização de treino, seguindo
 * o layout do Figma: cabeçalho com título + ações, seção "Informações Gerais"
 * e "Parâmetros" lado a lado, e tabela de "Exercícios Selecionados" abaixo.
 */
export function TreinoFormulario({ modo }: TreinoFormularioProps) {
  const { id } = useParams();
  const treinoId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const modoAtual = modo;
  const somenteLeitura = modoAtual === 'visualizar';

  const [treinoCarregado, setTreinoCarregado] = React.useState<TreinoDetalhe | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = React.useState(Boolean(treinoId));
  const [erroCarregamento, setErroCarregamento] = React.useState<string | null>(null);

  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = React.useState<Exercicio[]>([]);

  const [nome, setNome] = React.useState('');
  const [instrucoes, setInstrucoes] = React.useState('');
  const [fase, setFase] = React.useState<FaseTreino>('Iniciante');
  const [nivel, setNivel] = React.useState<NivelTreino>(1);
  const [quantidadeSemanas, setQuantidadeSemanas] = React.useState(4);
  const [descanso, setDescanso] = React.useState(30);
  const [exercicios, setExercicios] = React.useState<ExercicioVinculado[]>([]);

  const [selecionandoExercicios, setSelecionandoExercicios] = React.useState(false);
  const [modificado, setModificado] = React.useState(false);
  const [confirmandoSaida, setConfirmandoSaida] = React.useState(false);
  const [sucessoAberto, setSucessoAberto] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  React.useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => undefined);
    listarExercicios().then(setExerciciosDisponiveis).catch(() => undefined);
  }, []);

  React.useEffect(() => {
    if (!treinoId) {
      return;
    }
    let cancelado = false;
    setCarregandoDetalhe(true);
    setErroCarregamento(null);
    buscarTreino(treinoId)
      .then((detalhe) => {
        if (cancelado) return;
        setTreinoCarregado(detalhe);
        setNome(detalhe.nome);
        setInstrucoes(detalhe.instrucoes);
        setFase(detalhe.fase);
        setNivel(detalhe.nivel);
        setQuantidadeSemanas(detalhe.quantidadeSemanas);
        setDescanso(detalhe.descansoEntreSeriesSegundos);
        setExercicios(detalhe.exercicios);
      })
      .catch((erroCapturado) => {
        if (cancelado) return;
        setErroCarregamento(
          erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível carregar este treino.',
        );
      })
      .finally(() => {
        if (!cancelado) setCarregandoDetalhe(false);
      });
    return () => {
      cancelado = true;
    };
  }, [treinoId]);

  const exercicioPorId = React.useMemo(() => {
    const mapa = new Map<number, Exercicio>();
    exerciciosDisponiveis.forEach((exercicio) => mapa.set(exercicio.id, exercicio));
    return mapa;
  }, [exerciciosDisponiveis]);

  const categoriaPorId = React.useMemo(() => {
    const mapa = new Map<number, Categoria>();
    categorias.forEach((categoria) => mapa.set(categoria.id, categoria));
    return mapa;
  }, [categorias]);

  const exerciciosDetalhados: ExercicioVinculadoDetalhado[] = exercicios.map((vinculo) => {
    const exercicio = exercicioPorId.get(vinculo.exercicioId);
    const categoria = exercicio ? categoriaPorId.get(exercicio.categoriaId) : undefined;
    return {
      ...vinculo,
      nome: exercicio?.nome ?? 'Exercício não encontrado',
      categoria: categoria?.nome ?? '—',
    };
  });

  function marcarModificado() {
    if (!somenteLeitura) setModificado(true);
  }

  function adicionarExercicios(exerciciosSelecionados: Exercicio[]) {
    const idsJaVinculados = new Set(exercicios.map((e) => e.exercicioId));
    const novos: ExercicioVinculado[] = exerciciosSelecionados
      .filter((e) => !idsJaVinculados.has(e.id))
      .map((e) => ({
        exercicioId: e.id,
        series: 3,
        descansoSegundos: descanso,
        multiplicadorVelocidade: 1,
      }));
    setExercicios((atual) => [...atual, ...novos]);
    setModificado(true);
    setSelecionandoExercicios(false);
  }

  function removerExercicio(exercicioId: number) {
    setExercicios((atual) => atual.filter((e) => e.exercicioId !== exercicioId));
    setModificado(true);
  }

  function atualizarSeries(exercicioId: number, series: number) {
    setExercicios((atual) => atual.map((e) => (e.exercicioId === exercicioId ? { ...e, series } : e)));
    setModificado(true);
  }

  function atualizarVelocidade(exercicioId: number, multiplicadorVelocidade: number) {
    setExercicios((atual) =>
      atual.map((e) => (e.exercicioId === exercicioId ? { ...e, multiplicadorVelocidade } : e)),
    );
    setModificado(true);
  }

  const duracaoEstimadaPreview = calcularDuracaoPreview(exercicios, descanso);
  const duracaoExibida =
    modoAtual === 'visualizar' && treinoCarregado ? treinoCarregado.duracaoEstimadaMinutos : duracaoEstimadaPreview;

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro('Informe o nome do treino.');
      return;
    }
    if (!instrucoes.trim()) {
      setErro('Informe a instrução de uso de materiais.');
      return;
    }
    if (exercicios.length === 0) {
      setErro('Selecione ao menos um exercício para o treino.');
      return;
    }

    const dados: TreinoCriarRequest = {
      nome: nome.trim(),
      instrucoes: instrucoes.trim(),
      fase,
      nivel,
      quantidadeSemanas: Number(quantidadeSemanas),
      descansoEntreSeriesSegundos: Number(descanso),
      exercicios: exercicios.map((exercicio) => ({
        ...exercicio,
        descansoSegundos: Number(descanso),
      })),
    };

    setSalvando(true);
    try {
      if (modoAtual === 'editar' && treinoId) {
        await atualizarTreino(treinoId, dados);
      } else {
        await criarTreino(dados);
      }
      setModificado(false);
      setSucessoAberto(true);
    } catch (erroCapturado) {
      setErro(
        erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível salvar o treino. Tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  function voltarParaLista() {
    navigate('/treinos');
  }

  function tentarSair() {
    if (modificado && !somenteLeitura) {
      setConfirmandoSaida(true);
      return;
    }
    voltarParaLista();
  }

  if (selecionandoExercicios) {
    return (
      <SelecaoExerciciosTreino
        exerciciosDisponiveis={exerciciosDisponiveis}
        categorias={categorias}
        idsJaVinculados={exercicios.map((e) => e.exercicioId)}
        onVoltar={() => setSelecionandoExercicios(false)}
        onConfirmar={adicionarExercicios}
      />
    );
  }

  if (carregandoDetalhe) {
    return <p>Carregando...</p>;
  }

  if (erroCarregamento) {
    return (
      <div>
        <p className="pagina__erro">{erroCarregamento}</p>
        <button type="button" className="botao botao--contorno" onClick={voltarParaLista}>
          Voltar para a lista
        </button>
      </div>
    );
  }

  const titulo = modoAtual === 'criar' ? 'Novo Treino' : nome || (somenteLeitura ? 'Visualizar Treino' : 'Editar Treino');

  return (
    <>
      <form onSubmit={handleSubmit} className="treino-formulario">
        <div className="pagina__cabecalho">
          <h1>{titulo}</h1>
          <div className="pagina__acoes">
            {somenteLeitura ? (
              <>
                <button type="button" className="botao botao--contorno" onClick={voltarParaLista}>
                  Voltar
                </button>
                <button
                  type="button"
                  className="botao botao--primario"
                  onClick={() => navigate(`/treinos/${treinoId}/editar`)}
                >
                  Editar Treino
                </button>
              </>
            ) : (
              <>
                <button type="button" className="botao botao--contorno" onClick={tentarSair} disabled={salvando}>
                  Cancelar
                </button>
                <button type="submit" className="botao botao--primario" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar Treino'}
                </button>
              </>
            )}
          </div>
        </div>

        {erro ? <p className="pagina__erro">{erro}</p> : null}

        <div className="treino-formulario__grade">
          <div className="cartao">
            <h3>Informações Gerais</h3>

            <label className="campo">
              Nome do Treino
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  marcarModificado();
                }}
                placeholder="Ex: Fortalecimento Membros Superiores"
                disabled={somenteLeitura}
                required
              />
            </label>

            <label className="campo">
              Instrução de Uso de Materiais
              <textarea
                value={instrucoes}
                onChange={(e) => {
                  setInstrucoes(e.target.value);
                  marcarModificado();
                }}
                placeholder="Ex: Você deve usar tais materiais para esse treino..."
                disabled={somenteLeitura}
                required
              />
            </label>

            <div className="formulario__linha-dupla">
              <label className="campo">
                Fase
                <select
                  value={fase}
                  onChange={(e) => {
                    setFase(e.target.value as FaseTreino);
                    marcarModificado();
                  }}
                  disabled={somenteLeitura}
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </label>
              <label className="campo">
                Nível
                <select
                  value={nivel}
                  onChange={(e) => {
                    setNivel(Number(e.target.value) as NivelTreino);
                    marcarModificado();
                  }}
                  disabled={somenteLeitura}
                >
                  {NIVEIS.map((valor) => (
                    <option key={valor} value={valor}>
                      {valor}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="cartao">
            <h3>Parâmetros</h3>
            <div className="formulario__linha-dupla">
              <label className="campo">
                Quantidade de Semanas
                <input
                  type="number"
                  min={1}
                  value={quantidadeSemanas}
                  onChange={(e) => {
                    setQuantidadeSemanas(Number(e.target.value));
                    marcarModificado();
                  }}
                  disabled={somenteLeitura}
                  required
                />
              </label>
              <label className="campo">
                Tempo de Descanso entre Séries (segundos)
                <input
                  type="number"
                  min={0}
                  value={descanso}
                  onChange={(e) => {
                    setDescanso(Number(e.target.value));
                    marcarModificado();
                  }}
                  disabled={somenteLeitura}
                  required
                />
              </label>
            </div>
            <div className="formulario__duracao">
              <span>Duração Estimada</span>
              <strong>⏱ {duracaoExibida} min</strong>
            </div>
          </div>
        </div>

        <div className="cartao">
          <div className="formulario__secao-cabecalho">
            <h3>Exercícios Selecionados</h3>
            {!somenteLeitura ? (
              <button type="button" className="botao botao--contorno" onClick={() => setSelecionandoExercicios(true)}>
                + Adicionar Exercício
              </button>
            ) : null}
          </div>

          {exerciciosDetalhados.length === 0 ? (
            <p className="exercicios-selecionados__vazio">Nenhum exercício adicionado ainda.</p>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Exercício</th>
                    <th>Categoria</th>
                    <th>Séries</th>
                    <th>Velocidade</th>
                    {!somenteLeitura ? <th></th> : null}
                  </tr>
                </thead>
                <tbody>
                  {exerciciosDetalhados.map((exercicio) => (
                    <tr key={exercicio.exercicioId}>
                      <td>{exercicio.nome}</td>
                      <td>
                        <span className="badge-categoria">{exercicio.categoria}</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          value={exercicio.series}
                          onChange={(e) => atualizarSeries(exercicio.exercicioId, Number(e.target.value))}
                          aria-label={`Séries de ${exercicio.nome}`}
                          disabled={somenteLeitura}
                        />
                      </td>
                      <td>
                        <select
                          value={exercicio.multiplicadorVelocidade}
                          onChange={(e) => atualizarVelocidade(exercicio.exercicioId, Number(e.target.value))}
                          aria-label={`Velocidade de ${exercicio.nome}`}
                          disabled={somenteLeitura}
                        >
                          {VELOCIDADES.map((valor) => (
                            <option key={valor} value={valor}>
                              {valor.toFixed(2)}x
                            </option>
                          ))}
                        </select>
                      </td>
                      {!somenteLeitura ? (
                        <td>
                          <button
                            type="button"
                            onClick={() => removerExercicio(exercicio.exercicioId)}
                            aria-label={`Remover ${exercicio.nome}`}
                          >
                            <IconeLixeira />
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>

      {confirmandoSaida ? (
        <ModalConfirmacaoSaida onVoltar={() => setConfirmandoSaida(false)} onSair={voltarParaLista} />
      ) : null}

      {sucessoAberto ? (
        <ModalSucessoTreino
          mensagem="As informações foram salvas com sucesso no sistema."
          onFechar={voltarParaLista}
        />
      ) : null}
    </>
  );
}

/**
 * Preview client-side da duração (o valor definitivo vem do backend após
 * criar/atualizar/obterPorId — POST e PUT recalculam duracaoEstimadaMinutos).
 */
function calcularDuracaoPreview(exercicios: ExercicioVinculado[], descansoGlobal: number): number {
  if (exercicios.length === 0) return 0;
  const SEGUNDOS_EXECUCAO_BASE = 20;
  const totalSegundos = exercicios.reduce((acumulado, exercicio) => {
    const tempoExecucao = SEGUNDOS_EXECUCAO_BASE / (exercicio.multiplicadorVelocidade || 1);
    return acumulado + exercicio.series * (tempoExecucao + descansoGlobal);
  }, 0);
  return Math.max(1, Math.round(totalSegundos / 60));
}
