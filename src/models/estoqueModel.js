const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  livro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livro',
    required: [true, "Livro é obrigatório"]
  },
  quantidade: {
    type: Number,
    required: [true, "Quantidade é obrigatória"],
  },
  tamanho: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tamanho',
    required: [true, "Tamanho é obrigatório"]  
  },
  preco: {
    type: Number, 
    required: [true,"Preço do livro é obrigatorio"], 
  }
});

module.exports = mongoose.model('Estoque', schema);
