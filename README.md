# 🚀 TaskFlow - Kanban Inteligente

Fala! Esse é o **TaskFlow**, uma aplicação de gerenciamento de tarefas focada em produtividade e simplicidade. O projeto foi construído usando a **T3 Stack**, garantindo que tudo seja rápido, tipado e seguro.

---

## 🛠️ O que tem no projeto?

O objetivo aqui foi criar algo que não fosse só um "CRUDzinho" básico, mas uma ferramenta que desse gosto de usar.

- **Kanban Completo:** Arraste e solte suas tarefas entre colunas (To Do, In Progress, Done).
- **IA com Gemini:** Tá sem criatividade? Deixa que a IA escreve a descrição da tarefa pra você com base no título. Ela até detecta se você tá escrevendo em PT-BR ou Inglês!
- **Editor Notion-style:** Descrições com checklists, negrito, títulos e tudo mais, usando Tiptap.
- **Gestão de Equipe:** Dashboard para gerenciar usuários (convidar, editar roles e remover).
- **Segurança Real:** Só você mexe nas suas tasks. Implementei checks de propriedade em todas as rotas do back-end.
- **Mobile que funciona:** No celular, as modais viram "Bottom Sheets" (aquelas que deslizam de baixo), pra ficar fácil de usar só com uma mão.

---

## 🚀 Como rodar na sua máquina

### 1. Requisitos
- Node.js 20 ou superior.
- Docker (opcional, mas recomendado para o banco).

### 2. Passo a passo rápido
```bash
# 1. Clone e instale
git clone <url-do-repo>
cd challenge
npm install

# 2. Suba o banco de dados (Postgres)
docker-compose up -d

# 3. Configure o .env
# Crie um arquivo .env na raiz com:
DATABASE_URL="postgresql://juliolima:password@localhost:5432/taskflow"
BETTER_AUTH_SECRET=um_texto_aleatorio_qualquer
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_GENERATIVE_AI_API_KEY=sua_chave_do_gemini
```

### 3. Banco de dados e Run
```bash
# Gera as migrações e sobe pro banco
npm run db:generate
npm run db:migrate

# Inicia o modo dev
npm run dev
```
Acesse `http://localhost:3000`.

---

## 🏗️ Qualidade e Padronização (DX)

Para garantir que o código não vire uma bagunça, configurei algumas ferramentas essenciais:

- **Biome:** O sucessor do Prettier/ESLint. Ele cuida da formatação e do linting de forma instantânea. (Roda no `pre-commit`).
- **Husky & Lint-staged:** Nada de código mal formatado sobe pro repositório. O commit só passa se o Biome der o OK.
- **Commitlint:** Padronização de mensagens de commit seguindo o **Conventional Commits** (feat, fix, refactor, etc).
- **TypeScript Strict:** Tipagem forte de ponta a ponta, do banco de dados ao botão do front-end.

---

## 🏗️ Por que fiz desse jeito? (Decisões Técnicas)

1. **tRPC em tudo:** Escolhi o tRPC porque não queria ficar escrevendo rotas de API na mão e depois ter que tipar tudo de novo no front. Aqui, se eu mudo um campo no back, o front reclama na hora.
2. **Bottom Sheets no Mobile:** Modais centralizados em telas pequenas são horríveis de interagir. Mudei a lógica do Radix UI pra que no mobile tudo suba da parte de baixo da tela. É muito mais natural.
3. **Drizzle ORM:** Usei o Drizzle por ser leve e permitir queries relacionais bem diretas. Ele é perfeito pra esse tipo de arquitetura onde performance importa.
4. **Zod como verdade única:** Valido o dado quando ele entra no formulário e valido de novo quando ele chega no servidor. Se passar pelo Zod, eu sei que o dado tá limpo.
5. **Single Board:** Em vez de complicar com "Workspaces" e "Projetos", foquei em um Board principal por usuário. É mais direto ao ponto e resolve 90% dos casos de uso.

---
Feito com ☕ e TypeScript por Julio Lima.