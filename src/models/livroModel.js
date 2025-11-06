const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nome: {
        type: String, 
        required: [true,"Nome do livro é obrigatorio"], 
        trim: true
    },
    paginas: {
        type: Number, 
        required: [true,"Quantidade de páginas do livro é obrigatorio"], 
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autor',
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
    }
});

module.exports = mongoose.model('Livro',schema);
