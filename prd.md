# PRD — Quiz Web sobre Claude Code

## 1. Visão Geral

Aplicação web de quiz educacional sobre **Claude Code** (CLI/ferramenta da Anthropic), com perguntas no formato **Verdadeiro ou Falso**, organizadas em três níveis de dificuldade (Iniciante, Intermediário, Avançado). Projeto pessoal de aprendizado/portfólio, sem autenticação e sem backend próprio — o quiz é client-side, e o ranking usa um banco de dados hospedado (Supabase) apenas para persistir as pontuações entre usuários e dispositivos (ver §3.5/§4).

## 2. Contexto de Negócio

- **Objetivo**: projeto de estudo/portfólio pessoal, para praticar desenvolvimento front-end e consolidar conhecimento sobre Claude Code.
- **Público-alvo**: qualquer pessoa curiosa sobre Claude Code — de iniciantes que só ouviram falar da ferramenta até desenvolvedores avançados que já usam recursos como MCP, hooks e subagents.
- **Proposta de valor**: quiz rápido, leve, sem fricção (sem login, sem cadastro), que ensina sobre Claude Code de forma gamificada e progressiva por nível de dificuldade.
- **Métrica de sucesso** (informal, projeto pessoal): o quiz funciona ponta a ponta, é visualmente agradável, responsivo, e serve como peça de portfólio demonstrável.

## 3. Escopo Funcional

### 3.1 Fluxo principal

1. **Tela inicial (Home)**: título do quiz, breve descrição, e seleção de nível de dificuldade (Iniciante / Intermediário / Avançado). Botão para iniciar.
2. **Tela do Quiz**: exibe uma pergunta por vez em formato Verdadeiro/Falso, com indicador de progresso (ex.: "Pergunta 3/10"). Usuário responde clicando em "Verdadeiro" ou "Falso". Feedback visual imediato (acerto/erro) antes de avançar para a próxima pergunta.
3. **Tela de Resultado**: ao final das perguntas do nível, exibe pontuação final (nº de acertos, nº de erros, percentual de aproveitamento). Opções para: jogar novamente no mesmo nível, ou voltar à tela inicial e escolher outro nível.

### 3.2 Seleção de nível de dificuldade

- Três níveis fixos, selecionáveis pelo usuário na Home: **Iniciante**, **Intermediário**, **Avançado**.
- Cada nível é uma partida independente com seu próprio conjunto de perguntas.
- Sem progressão automática entre níveis — o usuário escolhe livremente.

### 3.3 Banco de perguntas

- Formato: **Verdadeiro ou Falso** exclusivamente.
- Volume: ~10 perguntas por nível (30 no total), embaralhadas a cada partida (ordem aleatória).
- Categorias de conteúdo que devem estar representadas (misturadas dentro de cada nível, com ênfase variável por nível):
  - **Negócios/Conceitos gerais**: o que é Claude Code, para que serve, casos de uso, benefícios.
  - **Comandos e CLI**: comandos slash, flags, uso do terminal, atalhos de teclado.
  - **Recursos técnicos avançados**: MCP, hooks, subagents, skills, permissions, Agent SDK.
  - **Integrações e ecossistema**: IDEs, GitHub Actions, Claude API, outras ferramentas integradas.
- Distribuição sugerida de ênfase por nível (Claude Code deve gerar o conteúdo das perguntas seguindo esta orientação):
  - **Iniciante**: maioria em Negócios/Conceitos gerais, com algumas de Comandos e CLI básicos.
  - **Intermediário**: maioria em Comandos e CLI, com algumas de Integrações e ecossistema.
  - **Avançado**: maioria em Recursos técnicos avançados, com algumas de Integrações avançadas.
- Cada pergunta deve ser uma afirmação factual clara e não ambígua sobre Claude Code, cuja resposta seja objetivamente Verdadeira ou Falsa.

### 3.4 Resultado e feedback

- Feedback imediato por pergunta: ao responder, o usuário vê se acertou ou errou.
  - **Se acertou**: feedback visual positivo simples (sem explicação adicional).
  - **Se errou**: mostrar a **resposta correta** e a **explicação** da afirmação, antes de avançar para a próxima pergunta.
- Ao final de cada partida: mostrar pontuação (acertos/erros) e percentual de aproveitamento.
- Não é necessário exibir uma tela de revisão consolidada com todas as perguntas ao final — a explicação já foi mostrada no momento do erro, durante o quiz.

### 3.5 Nickname e ranking

- Ao final da partida, o usuário pode digitar um **nickname** e salvar o resultado.
- O resultado (nickname, pontuação, percentual, nível, data) é salvo em um **banco de dados hospedado
  (Supabase/Postgres)** — o ranking é compartilhado entre todos os usuários do site, não apenas local ao
  navegador (mudança em relação à versão inicial do projeto, que usava `localStorage`; ver §4 e §6).
- Existe uma tela/seção de **"Melhores pontuações"** (ranking por nível de dificuldade), listando os
  resultados salvos por todos os usuários, ordenados por pontuação.
- Salvar o resultado é opcional — o usuário pode pular e apenas ver sua pontuação, ou voltar à Home sem salvar.
- Como o salvamento e a leitura do ranking dependem de uma chamada de rede, a interface deve cobrir os
  estados de carregando e de erro (ex.: "não foi possível salvar/carregar"), sem travar o restante do quiz.

## 4. Requisitos Não Funcionais

- **Responsivo**: deve funcionar bem em desktop e mobile.
- **Sem backend próprio**: o quiz em si (perguntas, navegação, pontuação da partida) é 100% client-side,
  sem servidor próprio ou API routes no Next.js. A única exceção é o ranking (§3.5), que depende de um
  banco de dados hospedado (Supabase) acessado diretamente do navegador — não há necessidade de servidor
  próprio nem de rotas de API do Next.js para isso.
- **Sem autenticação**: não há login, cadastro ou perfis de usuário.
- **Sem timer**: usuário responde no seu próprio tempo, sem pressão de tempo por pergunta ou por partida.
- **Idioma**: interface e enunciados das perguntas em **Português do Brasil**, mantendo termos técnicos específicos do produto em inglês quando for o termo oficial (ex.: "hooks", "subagents", "MCP", "skills", slash commands como `/compact`).
- **Performance**: aplicação leve, carregamento rápido, sem dependências pesadas desnecessárias.

## 5. Identidade Visual

- Estilo inspirado na identidade visual do Claude/Anthropic: paleta quente com tons de laranja/terracota como cor primária, fundo claro (tons de creme/off-white), tipografia limpa e legível.
- Interface simples e direta, com foco em legibilidade das perguntas e clareza dos botões de resposta (Verdadeiro/Falso bem diferenciados visualmente).
- Estados visuais claros para acerto (ex.: verde) e erro (ex.: vermelho/terracota escuro) no feedback imediato.

## 6. Fora de Escopo

Para manter o projeto enxuto, os itens abaixo **não** devem ser implementados nesta versão:

- Login, cadastro ou qualquer autenticação de usuário.
- Backend/API routes própria no Next.js (o único acesso a dados externos é o banco de ranking via Supabase, direto do navegador — ver §3.5/§4).
- Timer/cronômetro por pergunta ou por partida.
- Tela de revisão consolidada com todas as perguntas e explicações ao final da partida (a explicação já aparece pontualmente no momento do erro, durante o quiz).
- Compartilhamento social do resultado.
- Ranking com contas de usuário, autenticação ou funcionalidades sociais (comentários, amizades, etc.) — o ranking é uma lista pública simples por nível, sem identidade além do nickname digitado.
- Perguntas de múltipla escolha (somente Verdadeiro/Falso).

## 7. Especificação Técnica

### 7.1 Stack

- **Framework**: Next.js (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- Sem backend/API routes necessárias — toda a lógica roda no client. Preferir renderização client-side para as telas de quiz (`"use client"`), já que o estado do jogo (pergunta atual, pontuação) é local.
- Sem necessidade de bibliotecas de state management externas (Redux, Zustand etc.) — `useState`/`useReducer` do React são suficientes dado o escopo.

### 7.2 Estrutura de dados das perguntas

Banco de perguntas em arquivos **JSON separados do código**, para facilitar edição/expansão futura sem tocar em lógica da aplicação. Sugestão de estrutura (um arquivo por nível ou um único arquivo com campo `level`):

```json
{
  "id": "iniciante-01",
  "level": "iniciante",
  "category": "negocios",
  "statement": "Claude Code é uma ferramenta de linha de comando para desenvolvimento assistido por IA.",
  "answer": true,
  "explanation": "Correto: Claude Code é a CLI da Anthropic que roda no terminal para auxiliar tarefas de desenvolvimento com IA."
}
```

Campos:
- `id` (string, único)
- `level` (`"iniciante" | "intermediario" | "avancado"`)
- `category` (`"negocios" | "comandos" | "avancado" | "integracoes"`)
- `statement` (string — a afirmação a ser julgada V/F)
- `answer` (boolean — `true` se a afirmação é verdadeira, `false` se é falsa)
- `explanation` (string — texto curto exibido quando o usuário erra a pergunta, explicando por que a resposta correta é `answer`)

### 7.3 Ranking (Supabase/Postgres)

- Tabela `rankings`, com RLS habilitado e políticas restritas a `insert`/`select` para o papel `anon`
  (sem `update`/`delete` client-side):

```sql
create table public.rankings (
  id bigint generated always as identity primary key,
  nickname text not null check (char_length(nickname) between 1 and 20),
  level text not null check (level in ('iniciante', 'intermediario', 'avancado')),
  score integer not null,
  total integer not null,
  percentage integer not null,
  played_at timestamptz not null default now()
);
```

- Cada entrada corresponde a uma partida salva: `nickname`, `level`, `score`, `total`, `percentage`,
  `played_at` (equivalente ao campo `date` da versão em localStorage).
- Lista de entradas por nível, ordenada por `percentage`/`score` decrescente, exibida na tela de "Melhores
  pontuações". Acesso via cliente Supabase direto no navegador (chave anon pública), sem API routes.
- Requer as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ver `.env.example`).

### 7.4 Estrutura de páginas/rotas (App Router)

- `/` — Home com seleção de nível.
- `/quiz/[nivel]` — Tela do quiz para o nível selecionado (perguntas embaralhadas, navegação sequencial, pontuação em memória, feedback com explicação em caso de erro).
- Tela de resultado (com input de nickname e botão salvar) pode ser um estado dentro da própria rota `/quiz/[nivel]`, exibida após a última pergunta.
- `/ranking` — Tela de "Melhores pontuações", com seleção/filtro por nível, lendo os dados do Supabase.

### 7.5 Deploy

- Aplicação deve ser buildável e implantável na **Vercel** (padrão para projetos Next.js), exigindo apenas
  a configuração das variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` no
  painel do projeto (ver `.env.example`) — sem infraestrutura de servidor adicional.
- Deve também funcionar em ambiente de desenvolvimento local via `npm run dev`, com essas mesmas variáveis
  definidas em `.env.local`.

## 8. Critérios de Aceite

- [ ] Usuário consegue escolher um dos três níveis na Home e iniciar uma partida.
- [ ] Cada partida exibe ~10 perguntas Verdadeiro/Falso do nível escolhido, em ordem aleatória.
- [ ] Usuário recebe feedback visual imediato (correto/incorreto) ao responder cada pergunta.
- [ ] Quando o usuário erra, a resposta correta e a explicação da pergunta são exibidas antes de avançar.
- [ ] Ao final da partida, é exibida a pontuação final (acertos, erros, percentual).
- [ ] Usuário pode digitar um nickname e salvar o resultado (nickname, score, nível, data) no banco de dados (Supabase).
- [ ] Existe uma tela de ranking ("Melhores pontuações") por nível, lendo os dados salvos no Supabase.
- [ ] Usuário pode reiniciar o mesmo nível ou voltar à Home para escolher outro nível.
- [ ] Interface é responsiva e funciona corretamente em mobile e desktop.
- [ ] Banco de perguntas está em JSON separado do código, cobrindo as 4 categorias descritas, com distribuição de ênfase por nível conforme seção 3.3, e cada pergunta possui campo `explanation`.
- [ ] Projeto builda e roda com `npm run dev` localmente e é compatível com deploy na Vercel.
