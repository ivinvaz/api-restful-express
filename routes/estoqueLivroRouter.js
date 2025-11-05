const express = require('express');
const estoqueLivroController = require('../controller/estoqueLivroController');
const router = express.Router();

// POST - cria um novo estoque >necessário autentificação< 
router.post('/', estoqueLivroController.adicionarEstoque);

// PUT/:id - edita um estoque >necessário autentificação<
router.put('/:id', estoqueLivroController.buscarEstoques, estoqueLivroController.editarEstoque);

// GET - recebe todos os estoques
router.get('/', estoqueLivroController.listarEstoque);

// GET/:id - recebe os dados do estoque e do livro 
router.get('/:id', estoqueLivroController.buscarEstoques, estoqueLivroController.exibirEstoque);

// DELETE - deleta o estoque >necessário autentificação<
router.delete('/:id', estoqueLivroController.buscarEstoques, estoqueLivroController.deletarEstoque);