const express = require('express');
const estoqueLivroController = require('../controller/estoqueLivroController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

router.post('/', autentificacao.verificarTokenDeAutentificacao, estoqueLivroController.adicionarEstoque);

router.put('/:id', autentificacao.verificarTokenDeAutentificacao, estoqueLivroController.buscarEstoques, estoqueLivroController.editarEstoque);

router.get('/', estoqueLivroController.listarEstoque);

router.get('/:id', estoqueLivroController.buscarEstoques, estoqueLivroController.exibirEstoque);

router.delete('/:id', autentificacao.verificarTokenDeAutentificacao, estoqueLivroController.buscarEstoques, estoqueLivroController.deletarEstoque);

module.exports = router;
