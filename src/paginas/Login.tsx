import React from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ApiError } from '../api/client';
import { loginPesquisador, obterSessao, salvarSessao } from '../api/autenticacao';
import { CampoSenha } from '../componentes/CampoSenha';
import { LayoutAutenticacao } from '../layout/LayoutAutenticacao';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // Página que o pesquisador tentou abrir antes de ser mandado para o login.
  const origem = (location.state as { origem?: string } | null)?.origem ?? '/dashboard';
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [entrando, setEntrando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);
    setEntrando(true);
    try {
      const pesquisador = await loginPesquisador({ email: email.trim(), senha });
      salvarSessao(pesquisador);
      navigate(origem, { replace: true });
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ApiError ? erroCapturado.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setEntrando(false);
    }
  };

  if (obterSessao()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LayoutAutenticacao>
      <form className="login__cartao" onSubmit={handleSubmit}>
        <h2 className="login__titulo">Entrar</h2>
        <p className="login__subtitulo">Informe seu email e senha para acessar o sistema.</p>

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

        <CampoSenha
          rotulo="Senha"
          valor={senha}
          onChange={setSenha}
          placeholder="Digite sua senha"
          autoComplete="current-password"
        />

        <Link to="/esqueci-senha" className="login__link login__link--direita">
          Esqueci minha senha
        </Link>

        {erro ? <p className="pagina__erro login__erro">{erro}</p> : null}

        <button type="submit" className="botao botao--primario login__botao" disabled={entrando}>
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </LayoutAutenticacao>
  );
}
