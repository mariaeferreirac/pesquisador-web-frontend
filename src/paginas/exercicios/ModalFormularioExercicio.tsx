import React from 'react';

import { ApiError } from '../../api/client';
import { atualizarExercicio, criarExercicio } from '../../api/exercicios';
import { IconeArquivo, IconeFechar, IconeNuvemUpload } from '../../componentes/icones';
import { Modal } from '../../componentes/Modal';
import { ModalConfirmacaoSaida } from './ModalConfirmacaoSaida';
import type { Categoria, Exercicio } from '../../types/api';

const NIVEIS = [1, 2, 3];
const FORMATOS_VIDEO_ACEITOS = 'video/mp4,video/webm,video/quicktime';

type ModalFormularioExercicioProps = {
  exercicio?: Exercicio;
  categorias: Categoria[];
  onFechar: () => void;
  onSalvo: (exercicio: Exercicio) => void;
};

export function ModalFormularioExercicio({
  exercicio,
  categorias,
  onFechar,
  onSalvo,
}: ModalFormularioExercicioProps) {
  const editando = Boolean(exercicio);
  const [nome, setNome] = React.useState(exercicio?.nome ?? '');
  const [categoriaId, setCategoriaId] = React.useState(exercicio?.categoriaId ?? categorias[0]?.id ?? 0);
  const [nivel, setNivel] = React.useState(exercicio?.nivel ?? NIVEIS[0]);
  const [descricao, setDescricao] = React.useState(exercicio?.instrucao.join(' ') ?? '');
  const [arquivoVideo, setArquivoVideo] = React.useState<File | null>(null);
  const [arrastandoArquivo, setArrastandoArquivo] = React.useState(false);
  const [modificado, setModificado] = React.useState(false);
  const [confirmandoSaida, setConfirmandoSaida] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const inputArquivoRef = React.useRef<HTMLInputElement>(null);

  const selecionarArquivo = (arquivo: File | undefined | null) => {
    if (!arquivo) {
      return;
    }
    setArquivoVideo(arquivo);
    setModificado(true);
  };

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);

    if (!arquivoVideo && !exercicio) {
      setErro('Selecione o vídeo da execução do exercício.');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        nome,
        categoriaId: Number(categoriaId),
        nivel: Number(nivel),
        instrucao: [descricao.trim()].filter((linha) => linha.length > 0),
        ...(arquivoVideo ? { video: arquivoVideo } : {}),
      };
      const resultado = exercicio
        ? await atualizarExercicio(exercicio.id, dados)
        : await criarExercicio(dados as typeof dados & { video: File });
      onSalvo(resultado);
      onFechar();
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível salvar o exercício.');
    } finally {
      setSalvando(false);
    }
  };

  const tentarFechar = () => {
    if (modificado) {
      setConfirmandoSaida(true);
      return;
    }
    onFechar();
  };

  return (
    <>
      <Modal onFechar={tentarFechar} largura={520}>
        <form onSubmit={handleSubmit}>
        <div className="modal__cabecalho">
          <h2 className="modal__titulo">{editando ? 'Editar Exercício' : 'Cadastrar Novo Exercício'}</h2>
          <button type="button" className="modal__fechar" onClick={tentarFechar} aria-label="Fechar">
            <IconeFechar />
          </button>
        </div>

        <div className="modal__corpo modal__corpo--grade">
          <label className="campo">
            Nome do Exercício
            <input
              type="text"
              value={nome}
              onChange={(evento) => {
                setNome(evento.target.value);
                setModificado(true);
              }}
              placeholder="Ex: Alongamento de Panturrilha"
              autoFocus
              required
            />
          </label>

          <label className="campo">
            Categoria
            <select
              value={categoriaId}
              onChange={(evento) => {
                setCategoriaId(Number(evento.target.value));
                setModificado(true);
              }}
              required
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            Nível
            <select
              value={nivel}
              onChange={(evento) => {
                setNivel(Number(evento.target.value));
                setModificado(true);
              }}
              required
            >
              {NIVEIS.map((valor) => (
                <option key={valor} value={valor}>
                  Nível {valor}
                </option>
              ))}
            </select>
          </label>

          <div className="campo">
            Vídeo da Execução
            <div
              className={`area-upload${arrastandoArquivo ? ' area-upload--ativa' : ''}`}
              onClick={() => inputArquivoRef.current?.click()}
              onDragOver={(evento) => {
                evento.preventDefault();
                setArrastandoArquivo(true);
              }}
              onDragLeave={() => setArrastandoArquivo(false)}
              onDrop={(evento) => {
                evento.preventDefault();
                setArrastandoArquivo(false);
                selecionarArquivo(evento.dataTransfer.files[0]);
              }}
            >
              {arquivoVideo ? (
                <>
                  <IconeArquivo className="area-upload__icone" />
                  <span className="area-upload__texto">{arquivoVideo.name}</span>
                  <span className="area-upload__dica">Clique para trocar o vídeo</span>
                </>
              ) : exercicio ? (
                <>
                  <IconeArquivo className="area-upload__icone" />
                  <span className="area-upload__texto">Vídeo já cadastrado</span>
                  <span className="area-upload__dica">Clique ou arraste para substituir</span>
                </>
              ) : (
                <>
                  <IconeNuvemUpload className="area-upload__icone" />
                  <span className="area-upload__texto">Arraste e solte o vídeo da execução aqui</span>
                  <span className="area-upload__dica">MP4, WebM ou MOV (Máx. 50MB)</span>
                </>
              )}
              <input
                ref={inputArquivoRef}
                type="file"
                accept={FORMATOS_VIDEO_ACEITOS}
                className="area-upload__input"
                onChange={(evento) => selecionarArquivo(evento.target.files?.[0])}
              />
            </div>
          </div>

          <label className="campo">
            Descrição
            <input
              type="text"
              value={descricao}
              onChange={(evento) => {
                setDescricao(evento.target.value);
                setModificado(true);
              }}
              placeholder="Ex: Pegue uma Cadeira"
              required
            />
          </label>

          {erro ? <p className="pagina__erro">{erro}</p> : null}
        </div>

        <div className="modal__rodape">
          <button type="button" className="botao botao--contorno" onClick={tentarFechar}>
            Cancelar
          </button>
          <button type="submit" className="botao botao--primario" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </div>
        </form>
      </Modal>

      {confirmandoSaida ? (
        <ModalConfirmacaoSaida onVoltar={() => setConfirmandoSaida(false)} onSair={onFechar} />
      ) : null}
    </>
  );
}
