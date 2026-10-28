import { useEffect, useState } from 'react';

import { IconeAlerta, IconeFechar, IconeLapis, IconePlus, IconeTendencia, IconeUsuarios } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import { CartaoPainel } from './CartaoPainel';
import { FormularioAlertaEsforco } from './FormularioAlertaEsforco';
import type { DadosFormularioAlerta } from './FormularioAlertaEsforco';
import { formatarPercentual } from './formatadores';
import { montarTituloAlerta } from './dashboard.mock';
import type { AlertaEsforco, AlertasEsforco as AlertasEsforcoDados } from './dashboard.mock';

type ModalEstado =
  | { tipo: 'nenhum' }
  | { tipo: 'participantes'; alerta: AlertaEsforco }
  | { tipo: 'formulario'; alerta: AlertaEsforco | null };

export function AlertasEsforco({ dados }: { dados: AlertasEsforcoDados }) {
  const [alertas, setAlertas] = useState<AlertaEsforco[]>(dados.alertas);
  const [modal, setModal] = useState<ModalEstado>({ tipo: 'nenhum' });

  useEffect(() => {
    setAlertas(dados.alertas);
  }, [dados.alertas]);

  function salvarAlerta(dadosFormulario: DadosFormularioAlerta) {
    if (modal.tipo === 'formulario' && modal.alerta) {
      setAlertas((atual) =>
        atual.map((item) =>
          item.id === modal.alerta?.id
            ? {
                ...item,
                ...dadosFormulario,
              }
            : item,
        ),
      );
    } else {
      const novo: AlertaEsforco = {
        id: `alerta-${Date.now()}`,
        ...dadosFormulario,
        pctGrupo: 0,
        participantes: [],
      };
      setAlertas((atual) => [...atual, novo]);
    }
    setModal({ tipo: 'nenhum' });
  }

  function excluirAlerta() {
    if (modal.tipo !== 'formulario' || !modal.alerta) return;
    const id = modal.alerta.id;
    setAlertas((atual) => atual.filter((item) => item.id !== id));
    setModal({ tipo: 'nenhum' });
  }

  return (
    <>
      <CartaoPainel
        titulo="Alertas de esforço"
        className="painel-alertas"
        acao={
          <button
            type="button"
            className="botao botao--contorno painel-alertas__acao"
            onClick={() => setModal({ tipo: 'formulario', alerta: null })}
          >
            <IconePlus />
            Adicionar alerta
          </button>
        }
      >
        {alertas.length === 0 ? (
          <p className="painel-alertas__vazio">Nenhum alerta configurado. Adicione uma regra para acompanhar o grupo.</p>
        ) : (
          <ul className="painel-alertas__lista">
            {alertas.map((alerta) => {
              const Icone = alerta.severidade === 'critico' ? IconeAlerta : IconeTendencia;
              const titulo = montarTituloAlerta(alerta);
              const disparado = alerta.pctGrupo > alerta.pctMinimoAtivos;

              return (
                <li
                  key={alerta.id}
                  className={`painel-alerta painel-alerta--${alerta.severidade}${disparado ? '' : ' painel-alerta--inativo'}`}
                >
                  <div className="painel-alerta__linha">
                    <button
                      type="button"
                      className="painel-alerta__botao"
                      onClick={() => setModal({ tipo: 'participantes', alerta })}
                      aria-haspopup="dialog"
                    >
                      <Icone className="painel-alerta__icone" />
                      <div className="painel-alerta__texto">
                        <strong className="painel-alerta__titulo">{titulo}</strong>
                        <p className="painel-alerta__descricao">
                          {alerta.descricao}{' '}
                          <span className="painel-alerta__pct">
                            (atual: {formatarPercentual(alerta.pctGrupo)}
                            {disparado ? ' · disparado' : ' · abaixo do limiar'})
                          </span>
                        </p>
                      </div>
                      <IconeUsuarios className="painel-alerta__icone-pessoas" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="painel-alerta__editar"
                      onClick={() => setModal({ tipo: 'formulario', alerta })}
                      aria-label={`Editar alerta ${titulo}`}
                    >
                      <IconeLapis />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CartaoPainel>

      {modal.tipo === 'participantes' ? (
        <Modal onFechar={() => setModal({ tipo: 'nenhum' })} largura={420}>
          <div className="modal__cabecalho">
            <h2 className="modal__titulo">{montarTituloAlerta(modal.alerta)}</h2>
            <button
              type="button"
              className="modal__fechar"
              onClick={() => setModal({ tipo: 'nenhum' })}
              aria-label="Fechar"
            >
              <IconeFechar />
            </button>
          </div>

          <div className="modal__corpo">
            {modal.alerta.participantes.length === 0 ? (
              <p className="painel-alerta-modal__descricao">
                Nenhum participante correspondente ainda. A regra já está ativa e passará a listar nomes quando houver
                matches.
              </p>
            ) : (
              <>
                <p className="painel-alerta-modal__descricao">
                  <IconeUsuarios className="painel-alerta-modal__icone-titulo" aria-hidden="true" />
                  Participantes que fazem parte deste grupo ({modal.alerta.participantes.length}):
                </p>
                <ul className="painel-alerta-modal__lista">
                  {modal.alerta.participantes.map((nome) => (
                    <li key={nome}>
                      <IconeUsuarios className="painel-alerta-modal__icone" aria-hidden="true" />
                      {nome}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Modal>
      ) : null}

      {modal.tipo === 'formulario' ? (
        <FormularioAlertaEsforco
          inicial={modal.alerta}
          onSalvar={salvarAlerta}
          onExcluir={modal.alerta ? excluirAlerta : undefined}
          onFechar={() => setModal({ tipo: 'nenhum' })}
        />
      ) : null}
    </>
  );
}
