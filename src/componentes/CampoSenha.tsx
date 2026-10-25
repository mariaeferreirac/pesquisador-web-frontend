import React from 'react';

import { IconeOlho, IconeOlhoFechado } from './icones';

type CampoSenhaProps = {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  autoComplete: 'current-password' | 'new-password';
  autoFocus?: boolean;
};

export function CampoSenha({ rotulo, valor, onChange, placeholder, autoComplete, autoFocus }: CampoSenhaProps) {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  return (
    <label className="campo">
      {rotulo}
      <div className="login__senha">
        <input
          type={mostrarSenha ? 'text' : 'password'}
          value={valor}
          onChange={(evento) => onChange(evento.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required
        />
        <button
          type="button"
          className="login__senha-toggle"
          onClick={() => setMostrarSenha((atual) => !atual)}
          aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {mostrarSenha ? <IconeOlhoFechado /> : <IconeOlho />}
        </button>
      </div>
    </label>
  );
}
