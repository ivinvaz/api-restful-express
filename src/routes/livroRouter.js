const express = require('express');
const livroController = require('../controller/livroController');
const router = express.Router();

// POST - cria um livro >necessário autentificação< 
router.post('/', livroController.adicionarLivro);

// PUT/:id - edita um livro >necessário autentificação< 
router.put('/:id', livroController.buscarLivro, livroController.editarLivro);

// GET - recebe todos os livros
router.get('/', livroController.listarLivros);

// GET/:id - recebe os dados do livro
router.get('/:id', livroController.buscarLivro, livroController.exibirLivro);

// DELETE - deleta o livro, mas primeiro retira o seu registro da tabela estoque >necessário autentificação<
router.delete('/:id', livroController.buscarLivro, livroController.deletarLivro);