const express = require('express');
const categoriaLivroController = require('../controller/categoriaLivroController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

router.post('/', autentificacao.verificarTokenDeAutentificacao, categoriaLivroController.adicionarCategoria);

router.put('/:id', autentificacao.verificarTokenDeAutentificacao, categoriaLivroController.buscarCategoria, categoriaLivroController.editarCategoria);

router.get('/', categoriaLivroController.listarCategorias);

router.get('/:id', categoriaLivroController.buscarCategoria, categoriaLivroController.exibirCategoria);

router.delete('/:id', autentificacao.verificarTokenDeAutentificacao, categoriaLivroController.buscarCategoria, categoriaLivroController.deletarCategoria);

module.exports = router;
