const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome do tamanho é obrigatório"],
    trim: true
  }
});

module.exports = mongoose.model('Tamanho', schema);
