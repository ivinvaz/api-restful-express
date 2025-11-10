const mongoose = require('mongoose');
const Tamanho = require('../models/tamanhoModel');
const Estoque = require('../models/estoqueModel');

async function adicionarTamanho(req,res){
    try{
        const novoTamanho = await Tamanho.create({
            nome: req.body.nome
        })
        return res.status(201).json(novoTamanho);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarTamanho(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});
    try{
        const tamanhoAtualizado = await Tamanho.findOneAndUpdate(
            {
                _id:id
            },
            {
                nome: req.body.nome
            },
            {
                runValidators: true, 
                new:true
            }
        )
        return res.status(200).json(tamanhoAtualizado);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarTamanhos(req,res){
    try{
        const tamanhosListados = await Tamanho.find({});
        return res.status(200).json(tamanhosListados);    
    }catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarTamanho(req,res,next){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    const tamanhoEncontrado = await Tamanho.findOne({_id:id});
    if(tamanhoEncontrado){
        req.tamanho = tamanhoEncontrado;
        return next();
    }else{
        return res.status(404).json({msg:"Tamanho não encontrado"});
    }
}

async function exibirTamanho(req,res){
    return res.status(200).json(req.tamanho);
}

async function deletarTamanho(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    try{
        const EstoquesAlterados = await Estoque.updateMany({ tamanho: id }, { $set: { tamanho: null } });
        const tamanhoRemovido = await Tamanho.findOneAndDelete({_id:id});
        return res.status(204).json({});
    }catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = {adicionarTamanho, editarTamanho, listarTamanhos, buscarTamanho, exibirTamanho, deletarTamanho};
