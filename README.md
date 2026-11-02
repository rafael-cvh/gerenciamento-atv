
# Gerenciador de Tarefas

Aplicação web para gerenciamento de tarefas, desenvolvida como atividade do curso Técnico em Informática do IFMA.

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- Clerk
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- shadcn/ui

## Funcionalidades

- Cadastro e login de usuários.
- Cadastro de tarefas.
- Listagem das tarefas do usuário.
- Edição e exclusão de tarefas.
- Conclusão e reabertura de tarefas.
- Proteção das tarefas por usuário.

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/rafael-cvh/gerenciamento-atv.git
```

### 2. Entrar na pasta

```bash
cd gerenciamento-atv
```

### 3. Instalar as dependências

```bash
bun install
```

### 4. Configurar as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as credenciais do PostgreSQL e do Clerk.

### 5. Configurar o banco de dados

Certifique-se de que o PostgreSQL esteja em execução e que o banco `gerenciamento_atv` exista.

### 6. Executar as migrações

```bash
bunx prisma migrate deploy
```

### 7. Gerar o Prisma Client

```bash
bunx prisma generate
```

### 8. Iniciar o projeto

```bash
bun run dev
```

Acesse http://localhost:3000 no navegador.
