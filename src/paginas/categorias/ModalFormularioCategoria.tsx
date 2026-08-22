import React from 'react';

import { ApiError } from '../../api/client';
import { atualizarCategoria, criarCategoria } from '../../api/categorias';
import { IconeFechar } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import type { Categoria } from '../../types/api';

type ModalFormularioCategoriaProps = {
  categoria?: Categoria;
  onFechar: () => void;
  onSalvo: (categoria: Categoria) => void;
};

export function ModalFormularioCategoria({ categoria, onFechar, onSalvo }: ModalFormularioCategoriaProps) {
  const editando = Boolean(categoria);
  const [nome, setNome] = React.useState(categoria?.nome ?? '');
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      const resultado = categoria
        ? await atualizarCategoria(categoria.id, nome)
        : await criarCategoria(nome);
      onSalvo(resultado);
      onFechar();
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível salvar a categoria.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal onFechar={onFechar}>
      <form onSubmit={handleSubmit}>
        <div className="modal__cabecalho">
          <h2 className="modal__titulo">{editando ? 'Editar Categoria' : 'Cadastrar Categoria'}</h2>
          <button type="button" className="modal__fechar" onClick={onFechar} aria-label="Fechar">
            <IconeFechar />
          </button>
        </div>

        <div className="modal__corpo">
          <label className="campo">
            Nome da Categoria
            <input
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              autoFocus
              required
            />
          </label>

          {erro ? <p className="pagina__erro">{erro}</p> : null}
        </div>

        <div className="modal__rodape">
          <button type="button" className="botao botao--contorno" onClick={onFechar}>
            Cancelar
          </button>
          <button type="submit" className="botao botao--primario" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
