const express = require('express');
const autentificacaoController = require('../controller/autentificacaoController');
const usuarioController = require('../controller/usuarioController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

router.post('/', usuarioController.adicionarUsuario);

router.post('/login', autentificacaoController.logarUsuario);

router.post('/renova', autentificacao.verificarTokenDeAutentificacao, autentificacao.renovarTokenDeAutentificacao);

router.get('/', autentificacao.verificarTokenDeAutentificacao, usuarioController.listarUsuarios);

router.get('/:id', autentificacao.verificarTokenDeAutentificacao, usuarioController.buscarUsuario, usuarioController.exibirUsuario);

router.put('/:id', autentificacao.verificarTokenDeAutentificacao, usuarioController.buscarUsuario, usuarioController.editarUsuario);

router.delete('/:id', autentificacao.verificarTokenDeAutentificacao, usuarioController.buscarUsuario, usuarioController.deletarUsuario);

module.exports = router;

