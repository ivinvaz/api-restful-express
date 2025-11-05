const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome do usuário é obrigatório"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email do usuário é obrigatório"],
        trim: true,
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: [true, "Senha do usuário é obrigatório"],
        trim: true,
        select:false
    }
})

module.exports = mongoose.model('Usuario', schema);