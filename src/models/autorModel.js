const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome do autor é obrigatório"],
    trim: true
  },
  idade: {
    type: Number,
    required: [true, "Idade do autor é obrigatória"],
  },
  nacionalidade: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Autor', schema);
