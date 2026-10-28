import { useState } from 'react';
import type { FormEvent } from 'react';

import { IconeFechar } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import {
  descricaoPadraoAlerta,
  montarTituloAlerta,
  ROTULO_FAIXA_ESFORCO,
  ROTULO_FASE,
} from './dashboard.mock';
import type { AlertaEsforco, FaixaEsforco, Fase, SeveridadeAlerta } from './dashboard.mock';

export type DadosFormularioAlerta = Omit<AlertaEsforco, 'id' | 'pctGrupo' | 'participantes'>;

interface FormularioAlertaEsforcoProps {
  inicial?: AlertaEsforco | null;
  onSalvar: (dados: DadosFormularioAlerta) => void;
  onExcluir?: () => void;
  onFechar: () => void;
}

const FASES: Fase[] = ['iniciante', 'intermediario', 'avancado'];
const FAIXAS: FaixaEsforco[] = ['0-3', '4-6', '7-10'];

export function FormularioAlertaEsforco({ inicial, onSalvar, onExcluir, onFechar }: FormularioAlertaEsforcoProps) {
  const editando = Boolean(inicial);
  const faixaInicial: FaixaEsforco = inicial?.faixaEsforco ?? '7-10';
  const [severidade, setSeveridade] = useState<SeveridadeAlerta>(inicial?.severidade ?? 'critico');
  const [fase, setFase] = useState<Fase>(inicial?.fase ?? 'iniciante');
  const [faixaEsforco, setFaixaEsforco] = useState<FaixaEsforco>(faixaInicial);
  const [treinosSeguidosMinimos, setTreinosSeguidosMinimos] = useState(inicial?.treinosSeguidosMinimos ?? 3);
  const [pctMinimoAtivos, setPctMinimoAtivos] = useState(inicial?.pctMinimoAtivos ?? 5);
  const [descricao, setDescricao] = useState(inicial?.descricao ?? descricaoPadraoAlerta(faixaInicial));
  const [descricaoManual, setDescricaoManual] = useState(Boolean(inicial?.descricao));

  const previewTitulo = montarTituloAlerta({
    fase,
    faixaEsforco,
    treinosSeguidosMinimos,
    participantes: inicial?.participantes ?? [],
  });
  const previewDescricao = descricao.trim() || descricaoPadraoAlerta(faixaEsforco);

  function aoMudarFaixa(proximaFaixa: FaixaEsforco) {
    setFaixaEsforco(proximaFaixa);
    if (!descricaoManual) {
      setDescricao(descricaoPadraoAlerta(proximaFaixa));
    }
  }

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    onSalvar({
      severidade,
      descricao: previewDescricao,
      fase,
      faixaEsforco,
      treinosSeguidosMinimos: Math.max(1, treinosSeguidosMinimos),
      pctMinimoAtivos: Math.min(100, Math.max(1, pctMinimoAtivos)),
    });
  }

  function aoExcluir() {
    if (!onExcluir) return;
    if (window.confirm('Excluir este alerta? Esta ação não pode ser desfeita.')) {
      onExcluir();
    }
  }

  return (
    <Modal onFechar={onFechar} largura={520}>
      <form onSubmit={aoEnviar}>
        <div className="modal__cabecalho">
          <h2 className="modal__titulo">{editando ? 'Editar alerta' : 'Novo alerta de esforço'}</h2>
          <button type="button" className="modal__fechar" onClick={onFechar} aria-label="Fechar">
            <IconeFechar />
          </button>
        </div>

        <div className="modal__corpo modal__corpo--grade">
          <label className="campo">
            Fase
            <select value={fase} onChange={(evento) => setFase(evento.target.value as Fase)}>
              {FASES.map((item) => (
                <option key={item} value={item}>
                  {ROTULO_FASE[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            Faixa de esforço (OMNI)
            <select value={faixaEsforco} onChange={(evento) => aoMudarFaixa(evento.target.value as FaixaEsforco)}>
              {FAIXAS.map((item) => (
                <option key={item} value={item}>
                  {ROTULO_FAIXA_ESFORCO[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            Treinos seguidos (mínimo)
            <input
              type="number"
              min={1}
              max={20}
              value={treinosSeguidosMinimos}
              onChange={(evento) => setTreinosSeguidosMinimos(Math.max(1, Number(evento.target.value) || 1))}
              required
            />
          </label>

          <label className="campo">
            Disparar quando afetados &gt; (% dos ativos da fase)
            <input
              type="number"
              min={1}
              max={100}
              value={pctMinimoAtivos}
              onChange={(evento) => setPctMinimoAtivos(Math.min(100, Math.max(1, Number(evento.target.value) || 1)))}
              required
            />
          </label>

          <label className="campo">
            Severidade
            <select value={severidade} onChange={(evento) => setSeveridade(evento.target.value as SeveridadeAlerta)}>
              <option value="critico">Crítico</option>
              <option value="informativo">Informativo</option>
            </select>
          </label>

          <label className="campo">
            Descrição
            <textarea
              rows={3}
              value={descricao}
              onChange={(evento) => {
                setDescricaoManual(true);
                setDescricao(evento.target.value);
              }}
              placeholder={descricaoPadraoAlerta(faixaEsforco)}
              required
            />
          </label>

          <div className="painel-alerta-preview" aria-live="polite">
            <span className="painel-alerta-preview__rotulo">Prévia do card</span>
            <strong className="painel-alerta-preview__titulo">{previewTitulo}</strong>
            <p className="painel-alerta-preview__descricao">{previewDescricao}</p>
          </div>
        </div>

        <div className={`modal__rodape${editando ? ' modal__rodape--entre' : ''}`}>
          {editando && onExcluir ? (
            <button type="button" className="botao botao--perigo" onClick={aoExcluir}>
              Excluir alerta
            </button>
          ) : (
            <span />
          )}
          <div className="modal__rodape-acoes">
            <button type="button" className="botao botao--contorno" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="botao botao--primario">
              {editando ? 'Salvar alterações' : 'Criar alerta'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
