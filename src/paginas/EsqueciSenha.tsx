import React from 'react';
import { Link } from 'react-router-dom';

import { ApiError } from '../api/client';
import { redefinirSenha } from '../api/autenticacao';
import { CampoSenha } from '../componentes/CampoSenha';
import { LayoutAutenticacao } from '../layout/LayoutAutenticacao';

// Mesma regra validada pelo backend (src/utils/senha.ts).
function senhaAtendeRegra(senha: string): boolean {
  return senha.length >= 8 && /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha);
}

export function EsqueciSenha() {
  const [email, setEmail] = React.useState('');
  const [novaSenha, setNovaSenha] = React.useState('');
  const [confirmacao, setConfirmacao] = React.useState('');
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const [concluido, setConcluido] = React.useState(false);

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);

    if (!senhaAtendeRegra(novaSenha)) {
      setErro('A senha deve ter pelo menos 8 caracteres, com letras e números.');
      return;
    }
    if (novaSenha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }

    setSalvando(true);
    try {
      await redefinirSenha({ email: email.trim(), novaSenha });
      setConcluido(true);
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível redefinir a senha.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <LayoutAutenticacao>
      <form className="login__cartao" onSubmit={handleSubmit}>
        <h2 className="login__titulo">Redefinir senha</h2>

        {concluido ? (
          <>
            <p className="login__sucesso">Senha redefinida com sucesso. Agora é só entrar com a nova senha.</p>
            <Link to="/login" className="botao botao--primario login__botao">
              Ir para o login
            </Link>
          </>
        ) : (
          <>
            <p className="login__subtitulo">
              Informe seu email e a nova senha (pelo menos 8 caracteres, com letras e números).
            </p>

            <label className="campo">
              Email
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
                required
              />
            </label>

            <CampoSenha rotulo="Nova senha" valor={novaSenha} onChange={setNovaSenha} autoComplete="new-password" />
            <CampoSenha
              rotulo="Confirmar nova senha"
              valor={confirmacao}
              onChange={setConfirmacao}
              autoComplete="new-password"
            />

            {erro ? <p className="pagina__erro login__erro">{erro}</p> : null}

            <button type="submit" className="botao botao--primario login__botao" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar nova senha'}
            </button>

            <Link to="/login" className="login__link">
              Voltar para o login
            </Link>
          </>
        )}
      </form>
    </LayoutAutenticacao>
  );
}
