# pesquisador-web-frontend

Plataforma web para o pesquisador gerenciar exercícios, treinos, categorias e
acompanhar participantes. Consome a mesma API do app mobile
([`exercicios-app-backend`](https://github.com/mariaconradtech/exercicios-app-backend)).

Stack: React + TypeScript + Vite, `react-router-dom` para navegação.

Sem autenticação/verificação de login nesta entrega — todas as rotas são
públicas no cliente.

## Estrutura

```
src/
  api/          # chamadas HTTP (fetch) para cada recurso da API
    client.ts   # wrapper fetch: base URL, schema de erro {codigo, mensagem}
    categorias.ts, exercicios.ts, treinos.ts
  layout/
    Sidebar.tsx, LayoutPrincipal.tsx, icones.tsx
  paginas/
    Dashboard.tsx, Exercicios.tsx, Treinos.tsx, Categorias.tsx, Participantes.tsx
  types/api.ts  # tipos compartilhados (DTOs)
```

O menu segue o layout do design (Figma): "Usuários", "Instituições" e "Avaliações"
aparecem como itens estáticos (sem página por trás ainda — não existe essa
funcionalidade no backend). As páginas já construídas ficam como subitens de
"Treinos": Biblioteca de exercícios (`/exercicios`), Planos de Treino (`/treinos`),
Painel de indicadores (`/dashboard`), Categorias (`/categorias`) e Participantes
(`/participantes`).

## Rodando localmente

```powershell
npm install
npm run dev
```

Por padrão aponta para `http://localhost:3000` (variável `VITE_API_URL`, ver `.env` /
`.env.example`).

## O que já funciona

- Roteamento básico entre as páginas do domínio do pesquisador (sem gate de login).
- Cliente HTTP genérico (`src/api/client.ts`): espera erros no formato
  `{ codigo, mensagem }`.
- Páginas de Exercícios/Treinos/Categorias já chamam a API de verdade (`fetch`) e
  tratam os três estados (carregando, vazio, erro) — testado com o backend fora do
  ar, mostra a mensagem de erro corretamente em vez de travar.

## Implementação de cada chamada em `src/api/`:

| Rota esperada | Uso |
|---|---|
| `GET /categorias`, `POST /categorias` | listar/criar categorias |
| `GET /exercicios`, `POST /exercicios`, `PATCH /exercicios/:id`, `DELETE /exercicios/:id` | CRUD de exercícios |
| `GET /treinos`, `POST /treinos` | listar/criar treinos (com os `TreinoExercicio`) |

Requisitos que essas rotas precisam seguir (definidos para o projeto como um todo):
- REST: URL única por recurso, verbos HTTP semânticos, payload em JSON.
- Stateless: nada de sessão no servidor, cada requisição é independente.
- Erros no formato padronizado `{ codigo, mensagem }` com status HTTP consistente.
- Upload de vídeo de exercício: aceitar MP4/WebM/MOV, até 50MB.
