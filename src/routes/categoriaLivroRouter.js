const express = require('express');
const categoriaLivroController = require('../controller/categoriaLivroController');
const router = express.Router();

// POST - cria uma categoria >necessário autentificação<
router.post('/', categoriaLivroController.adicionarCategoria);

// PUT/:id - edita uma categoria >necessário autentificação<
router.put('/:id', categoriaLivroController.buscarCategoria, categoriaLivroController.editarCategoria);

// GET - recebe todos as categorias  
router.get('/', categoriaLivroController.listarCategorias);

// GET/:id - recebe os dados da categoria e seus livros registrados  
router.get('/:id', categoriaLivroController.buscarCategoria, categoriaLivroController.exibirCategoria);

// DELETE - deleta a categoria, mas primeiro retira o seu registro dos livros >necessário autentificação<
router.delete('/:id', categoriaLivroController.buscarCategoria, categoriaLivroController.deletarCategoria);