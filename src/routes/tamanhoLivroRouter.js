const express = require('express');
const tamanhoLivroController = require('../controller/tamanhoLivroController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

router.post('/', autentificacao.verificarTokenDeAutentificacao, tamanhoLivroController.adicionarTamanho);

router.put('/:id', autentificacao.verificarTokenDeAutentificacao, tamanhoLivroController.buscarTamanho, tamanhoLivroController.editarTamanho);

router.get('/', tamanhoLivroController.listarTamanhos);

router.get('/:id', tamanhoLivroController.buscarTamanho, tamanhoLivroController.exibirTamanho);

router.delete('/:id', autentificacao.verificarTokenDeAutentificacao, tamanhoLivroController.buscarTamanho, tamanhoLivroController.deletarTamanho);

module.exports = router;
