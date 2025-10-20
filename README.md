# Project README

Projeto: API Tasks  
Descrição: API RESTful para gerenciamento de tarefas usando Express, MVC, MongoDB com Mongoose, autenticação JWT, validações, testes com Jest e Supertest e documentação via Swagger UI.

---

## Quick Start

- Pré-requisitos
  - **Node.js** >= 16
  - **npm** ou **yarn**
  - **MongoDB** local ou URI para MongoDB Atlas

- Instalação
  - clone o repositório
  - instalar dependências
    - npm install
  - configurar variáveis de ambiente (ver seção Environment Variables)
  - iniciar servidor em modo dev
    - npm run dev
  - abrir documentação
    - acessar http://localhost:3000/api-docs

---

## Environment Variables

Crie um arquivo **.env** com as seguintes variáveis (usar os mesmos nomes em .env.example):

- **PORT** - porta da aplicação (ex 3000)
- **MONGO_URI** - URI de conexão com MongoDB
- **JWT_SECRET** - segredo para assinaturas JWT
- **JWT_EXPIRES_IN** - tempo de expiração do token (ex 1h)
- **NODE_ENV** - environment (development test production)

---

## Estrutura do Projeto

- **src/models** - Mongoose models (User, Task)
- **src/controllers** - lógica das rotas
- **src/routes** - definição de rotas e versionamento (/api/v1)
- **src/services** - lógica de integração entre controllers e modelos
- **src/middleware** - autenticação, validação e tratamento de erros
- **src/config** - conexão com DB e configs gerais
- **src/docs** - arquivo OpenAPI (yaml/json) para Swagger UI
- **src/tests** - testes unitários e de integração (Jest + Supertest)

---

## API Endpoints

Base path: **/api**

Observação sobre versionamento: todas as rotas expostas sob **/api/v1**.

- Auth
  - POST **/api/auth/register**
    - **Descrição**: registra novo usuário
    - **Body exemplo**
      - { "name": "João", "email": "joao@example.com", "password": "Senha@123" }
    - **Respostas**
      - 201 Created com objeto do usuário sem password
      - 400 Bad Request se dados inválidos

  - POST **/api/auth/login**
    - **Descrição**: autentica e retorna JWT
    - **Body exemplo**
      - { "email": "joao@example.com", "password": "Senha@123" }
    - **Respostas**
      - 200 OK com { "accessToken": "<token>" }
      - 401 Unauthorized se credenciais inválidas

- Tasks Public Read
  - GET **/api/tasks**
    - **Descrição**: lista tarefas com paginação e filtros
    - **Query params**
      - page number, limit number, status string, ownerId string
    - **Respostas**
      - 200 OK com lista paginada
      - 400 Bad Request para queries inválidas

  - GET **/api/tasks/:id**
    - **Descrição**: obtém tarefa por id
    - **Respostas**
      - 200 OK com objeto tarefa
      - 404 Not Found se não existir
      - 400 Bad Request para id inválido

- Tasks Protected Write
  - POST **/api/tasks**
    - **Autorização**: Bearer token necessário
    - **Descrição**: cria nova tarefa vinculada ao usuário autenticado
    - **Body exemplo**
      - { "title": "Comprar leite", "description": "1 litro", "dueDate": "2025-10-25T12:00:00Z", "status": "pending" }
    - **Respostas**
      - 201 Created com tarefa criada
      - 400 Bad Request para payload inválido
      - 401 Unauthorized se token ausente/ inválido

  - PATCH **/api/tasks/:id**
    - **Autorização**: Bearer token necessário
    - **Descrição**: atualização parcial; somente owner ou admin permitido
    - **Body exemplo**
      - { "status": "done" }
    - **Respostas**
      - 200 OK com tarefa atualizada
      - 400 Bad Request para payload inválido
      - 401 Unauthorized se token ausente/ inválido
      - 403 Forbidden se usuário não for owner
      - 404 Not Found se id não existir

  - DELETE **/api/tasks/:id**
    - **Autorização**: Bearer token necessário
    - **Descrição**: remove tarefa; somente owner ou admin permitido
    - **Respostas**
      - 204 No Content no sucesso
      - 401 Unauthorized se token ausente/ inválido
      - 403 Forbidden se usuário não for owner
      - 404 Not Found se id não existir

---

## Autenticação and Authorization

- Mecanismo: **JWT**
- Fluxo:
  - usuário faz login em **/auth/login**
  - recebe **accessToken** enviado no header Authorization como **Bearer <token>**
  - middleware **auth** valida token, injeta **req.user** com payload do token
  - rotas de escrita verificam **req.user.id** contra **task.ownerId** ou checam **role: admin**
  - 
---

## Testes

- Frameworks: **Jest** e **Supertest**
- Banco de testes: **mongodb-memory-server** para integração isolada
- Scripts npm
  - **npm test** roda suíte completa
  - **npm run test:watch** roda em modo watch
  - **npm run coverage** gera relatório de cobertura
- Meta de cobertura: **>= 80%**
- O que testar
  - controllers unitários
  - rotas com Supertest cobrindo cenários positivos e negativos
  - middleware de autenticação e autorização
  - validações de payload

---

## Documentação

- Swagger UI disponível em **/api-docs**
- Arquivo OpenAPI em **src/docs/openapi.yaml**
- Documentar todos os endpoints com exemplos de request e response e códigos HTTP esperados

---

## Como usar exemplos rápidos

- Registrar usuário
  - POST /api/v1/auth/register
  - Body JSON com name email password
- Autenticar
  - POST /api/v1/auth/login
  - Obter accessToken
- Criar tarefa
  - POST /api/v1/tasks com header Authorization Bearer token
- Listar tarefas
  - GET /api/v1/tasks?page=1&limit=10&status=pending

---

---

Fim do README. Copie e cole este conteúdo no arquivo README.md do repositório e atualize campos de equipe, exemplos e variáveis de ambiente conforme a implementação.
