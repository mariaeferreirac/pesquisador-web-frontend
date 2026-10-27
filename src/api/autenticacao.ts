import { apiRequest } from './client';
import type {
  LoginPesquisadorRequest,
  MensagemApi,
  PesquisadorLogado,
  RedefinirSenhaPesquisadorRequest,
} from '../types/api';

const CHAVE_SESSAO = 'pesquisadorLogado';

export function loginPesquisador(dados: LoginPesquisadorRequest): Promise<PesquisadorLogado> {
  return apiRequest<PesquisadorLogado>('/pesquisadores/login', { method: 'POST', body: dados });
}

export function redefinirSenha(dados: RedefinirSenhaPesquisadorRequest): Promise<MensagemApi> {
  return apiRequest<MensagemApi>('/pesquisadores/senha', { method: 'PATCH', body: dados });
}

export function salvarSessao(pesquisador: PesquisadorLogado): void {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(pesquisador));
}

export function obterSessao(): PesquisadorLogado | null {
  try {
    const valor = localStorage.getItem(CHAVE_SESSAO);
    return valor ? (JSON.parse(valor) as PesquisadorLogado) : null;
  } catch {
    return null;
  }
}

export function encerrarSessao(): void {
  localStorage.removeItem(CHAVE_SESSAO);
}
