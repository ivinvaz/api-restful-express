require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const conectarAoBancoDeDados = require('./config/database');

const documentacaoSwaggerRouter = require('./routes/documentacaoSwaggerRouter')

const categoriaLivroRouter = require('./routes/categoriaLivroRouter');
const tamanhoLivroRouter = require('./routes/tamanhoLivroRouter');
const estoqueLivroRouter = require('./routes/estoqueLivroRouter');
const autorLivroRouter = require('./routes/autorLivroRouter');
const livroRouter = require('./routes/livroRouter');
const usuarioRouter = require('./routes/usuarioRouter')

const app = express();

conectarAoBancoDeDados();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/api-documentation', documentacaoSwaggerRouter);

app.use('/api/v1/livro/categoria',categoriaLivroRouter);
app.use('/api/v1/livro/tamanho',tamanhoLivroRouter);
app.use('/api/v1/livro/estoque',estoqueLivroRouter);
app.use('/api/v1/livro/autor',autorLivroRouter);

app.use('/api/v1/livro',livroRouter);
app.use('/api/v1/usuario',usuarioRouter);

module.exports = app;