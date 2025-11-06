const express = require('express');
const autorLivroController = require('../controller/autorLivroController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

router.post('/', autentificacao.verificarTokenDeAutentificacao, autorLivroController.adicionarAutor);

router.put('/:id', autentificacao.verificarTokenDeAutentificacao, autorLivroController.buscarAutor, autorLivroController.editarAutor);

router.get('/', autorLivroController.listarAutores);

router.get('/:id', autorLivroController.buscarAutor, autorLivroController.exibirAutor);

router.delete('/:id', autentificacao.verificarTokenDeAutentificacao, autorLivroController.buscarAutor, autorLivroController.deletarAutor);
