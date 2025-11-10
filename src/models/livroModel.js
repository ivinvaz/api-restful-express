const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nome: {
        type: String, 
        required: [true,"Nome do livro é obrigatório"], 
        trim: true
    },
    paginas: {
        type: Number, 
        required: [true,"Quantidade de páginas do livro é obrigatório"], 
        validate: {
            validator: v => typeof v === 'number',
            message: props => 'Paginas não é um número válido'
        }
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
