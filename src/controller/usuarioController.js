const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

async function adicionarUsuario(req,res){
    try{
        const novoUsuario = await Usuario.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: await bcrypt.hash(req.body.senha, 10)
        });
        const usuarioResposta = novoUsuario.toObject();
        delete usuarioResposta.senha;
        return res.status(201).json(novoUsuario);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarUsuario(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});
    try{
        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            {
                _id:id
            },
            {
                nome: req.body.nome,
                email: req.body.email,
                senha: await bcrypt.hash(req.body.senha, 10)
            },
            {
                runValidators: true, 
                new:true
            }
        ).select('-senha');
        return res.status(200).json(usuarioAtualizado);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarUsuarios(req,res){
    try{
        const usuariosEncontrados = await Usuario.find({}).select('-senha');
        return res.status(200).json(usuariosEncontrados);
    }catch(err){
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }    
}

async function buscarUsuario(req,res,next){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    const usuarioEncontrado = await Usuario.findOne({_id:id}).select('-senha');
    if(usuarioEncontrado){
        req.usuario = usuarioEncontrado;
        return next();
    }else{
        return res.status(404).json({msg:"Usuário não encontrado"})
    }
}

async function exibirUsuario(req,res){
    return res.status(200).json(req.usuario);
}

async function deletarUsuario(req,res){
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: 'Parâmetro inválido' });

    try{
        const usuarioDeletado = await Usuario.findOneAndDelete({_id:id});
        return res.status(204).json({});
    }catch(err){
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
}

module.exports = { adicionarUsuario, editarUsuario, listarUsuarios, buscarUsuario, exibirUsuario, deletarUsuario};
