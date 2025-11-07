# API RESTful de Livros

Projeto backend de uma API RESTful desenvolvida com Node.js, Express e MongoDB para gerenciar usuários, autores, categorias, livros, tamanhos e estoques. Esta API foi criada com foco em rotas bem definidas e testes de integração usando Supertest + Jest.

## Sumário
- Sobre
- Tecnologias
- Estrutura do projeto
- Endpoints principais
- Variáveis de ambiente
- Instalação e execução
- Rodando os testes (local e CI)
- Recomendações e notas sobre desenvolvimento
- Contribuição

---

## Sobre
Esta API fornece CRUDs para os recursos abaixo e integra autenticação via JWT:
- Usuários (cadastro, login, renovação de token, listagem, edição, exclusão)
- Autores (CRUD)
- Categorias (CRUD)
- Livros (CRUD; relacionamentos com autor e categoria)
- Tamanhos (CRUD)
- Estoques (CRUD; relacionamentos com livro e tamanho)

A API foi concebida para ser usada como backend isolado (sem front-end). A documentação Swagger será adicionada posteriormente.

---

## Tecnologias
- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Tokens (jsonwebtoken)
- Bcrypt (hash de senhas)
- Jest + Supertest (testes)
- dotenv (variáveis de ambiente)

---

## Estrutura do projeto (resumida)
- /src
  - /config
    - database.js (conexão com MongoDB)
  - /controller
    - controllers por recurso (autorLivroController, livroController, estoqueLivroController, etc.)
  - /middleware
    - autentificacaoMiddleware.js (verificação/Geração de JWT)
  - /models
    - modelos Mongoose (Usuario, Autor, Categoria, Livro, Estoque, Tamanho)
  - /routes
    - routers por recurso (usuarioRouter, livroRouter, etc.)
  - /test
    - testes de integração (Jest + Supertest)
  - app.js (instância do Express)
- package.json

---

## Endpoints principais
Base path: /api/v1

Recursos e endpoints (resumo):

- Usuário
  - POST /api/v1/usuario — criar usuário
  - POST /api/v1/usuario/login — login (recebe token)
  - POST /api/v1/usuario/renova — renovar token (requere token atual)
  - GET /api/v1/usuario — listar (requere token)
  - GET /api/v1/usuario/:id — obter um usuário (requere token)
  - PUT /api/v1/usuario/:id — editar usuário (requere token)
  - DELETE /api/v1/usuario/:id — deletar (requere token)

- Autor
  - POST /api/v1/livro/autor — criar (requere token)
  - GET /api/v1/livro/autor — listar
  - GET /api/v1/livro/autor/:id — obter por id
  - PUT /api/v1/livro/autor/:id — editar (requere token)
  - DELETE /api/v1/livro/autor/:id — deletar (requere token)

- Categoria
  - POST /api/v1/livro/categoria — criar (requere token)
  - GET /api/v1/livro/categoria — listar
  - GET /api/v1/livro/categoria/:id — obter
  - PUT /api/v1/livro/categoria/:id — editar (requere token)
  - DELETE /api/v1/livro/categoria/:id — deletar (requere token)

- Livro
  - POST /api/v1/livro — criar (requere token)
  - GET /api/v1/livro — listar
  - GET /api/v1/livro/:id — obter
  - PUT /api/v1/livro/:id — editar (requere token)
  - DELETE /api/v1/livro/:id — deletar (requere token)

- Tamanho
  - POST /api/v1/livro/tamanho — criar (requere token)
  - GET /api/v1/livro/tamanho — listar
  - GET /api/v1/livro/tamanho/:id — obter
  - PUT /api/v1/livro/tamanho/:id — editar (requere token)
  - DELETE /api/v1/livro/tamanho/:id — deletar (requere token)

- Estoque
  - POST /api/v1/livro/estoque — criar (requere token)
  - GET /api/v1/livro/estoque — listar
  - GET /api/v1/livro/estoque/:id — obter
  - PUT /api/v1/livro/estoque/:id — editar (requere token)
  - DELETE /api/v1/livro/estoque/:id — deletar (requere token)

Observação: muitos endpoints de criação/edição aceitam relacionamentos por nome (ex.: enviar campo "livro": "Nome do livro") — o controller resolve o ObjectId correspondente e retorna objetos populados (livro e tamanho) nas respostas.

---

## Variáveis de ambiente necessárias
Crie um arquivo `.env` (não commitar) com as variáveis:

- JWT_SEGREDO — segredo para assinar/verificar tokens JWT
- MONGODB_USER — usuário do MongoDB (se usar Mongo Atlas)
- MONGODB_PASSWD — senha do MongoDB
- MONGODB_HOST — host/cluster (ex.: cluster0.mongodb.net)
- MONGODB_DBNAM — nome do banco de dados

Exemplo mínimo:
JWT_SEGREDO=algum-segredo-secreto
MONGODB_USER=usuario
MONGODB_PASSWD=senha
MONGODB_HOST=localhost:27017
MONGODB_DBNAM=apirestful_test

Dica: Para testes locais isolados, use mongodb-memory-server (explicado abaixo) para não depender de credenciais externas.

---

## Instalação e execução

1. Instalar dependências
   - npm install

2. Variáveis de ambiente
   - Crie `.env` com as variáveis listadas acima.

3. Rodar a aplicação (desenvolvimento)
   - npm run dev
   - Ou iniciar em produção:
   - npm start

O app por padrão executa a conexão com o banco ao inicializar (via conectarAoBancoDeDados em src/config/database.js). Em ambiente de desenvolvimento/CI recomenda-se usar configuração de banco apropriada.

---

## Rodando os testes

O projeto utiliza Jest + Supertest.

Observações antes de rodar:
- O app conecta no banco ao ser importado; para rodar testes sem um Mongo real, recomendamos usar mongodb-memory-server ou condicionar a conexão em app.js quando NODE_ENV === 'test'.

1. Rodar testes (única vez)
   - npm run test
   - Nota: o script atual pode estar configurado com --watchAll; para execução única ajuste em package.json para:
     "test": "jest --runInBand --detectOpenHandles"
