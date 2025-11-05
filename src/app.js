require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { conectarAoBancoDeDados } = require('./config/database');

const documentacaoSwaggerRouter = require('./routes/documentacaoSwaggerRouter');
const usuarioRouter = require('./routes/usuarioRouter')
const livroRouter = require('./routes/livroRouter');
const categoriaLivroRouter = require('./routes/categoriaLivroRouter');
const tamanhoLivroRouter = require('./routes/tamanhoLivroRouter');
const estoqueLivroRouter = require('./routes/estoqueLivroRouter');
const autorLivroRouter = require('./routes/autorLivroRouter');

const app = express();

conectarAoBancoDeDados();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-documentation',documentacaoSwaggerRouter);

app.use('/usuario',usuarioRouter);

app.use('/livro',livroRouter);
app.use('/livro/categoria',categoriaLivroRouter);
app.use('/livro/tamanho',tamanhoLivroRouter);
app.use('/livro/estoque',estoqueLivroRouter);
app.use('/livro/autor',autorLivroRouter);

module.exports = app;