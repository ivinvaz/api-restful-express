const express = require('express');
const livroController = require('../controller/livroController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

router.post('/', autentificacao.verificarTokenDeAutentificacao, livroController.adicionarLivro);

router.put('/:id', autentificacao.verificarTokenDeAutentificacao, livroController.buscarLivro, livroController.editarLivro);

router.get('/', livroController.listarLivros);

router.get('/:id', livroController.buscarLivro, livroController.exibirLivro);

router.delete('/:id', autentificacao.verificarTokenDeAutentificacao, livroController.buscarLivro, livroController.deletarLivro);
