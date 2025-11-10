const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome da categoria é obrigatória"],
    trim: true
  }
});

module.exports = mongoose.model('Categoria', schema);