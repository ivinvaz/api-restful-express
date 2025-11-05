const express = require('express');
const tamanhoLivroController = require('../controller/tamanhoLivroController');
const router = express.Router();

// POST - cria um tamanho >necessário autentificação<  
router.post('/', tamanhoLivroController.adicionarTamanho);

// PUT/:id - edita um tamanho >necessário autentificação<  
router.put('/:id', tamanhoLivroController.buscarTamanho, tamanhoLivroController.editarTamanho);

// GET - recebe todos os tamanhos 
router.get('/', tamanhoLivroController.listarTamanhos);

// GET/:id - recebe os dados do tamanho e seus livros registrados no estoque
router.get('/:id', tamanhoLivroController.buscarTamanho, tamanhoLivroController.exibirTamanho);

// DELETE - deleta a categoria, mas primeiro retira o seu registro do estoque e impede o delete caso tenham itens em estoque >necessário autentificação< 
router.delete('/:id', tamanhoLivroController.buscarTamanho, tamanhoLivroController.deletarTamanho);