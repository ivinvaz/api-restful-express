const mongoose = require('mongoose');
const Categoria = require('../models/categoriaModel');
const Livro = require('../models/livroModel');

async function adicionarCategoria(req,res){
    try{
        const novaCategoria = await Categoria.create({
            nome: req.body.nome
        })
        return res.status(201).json(novaCategoria);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarCategoria(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});
    try{
        const categoriaAtualizada = await Categoria.findOneAndUpdate(
            {_id:id},
            {
                nome: req.body.nome
            },
            {
                runValidators: true, 
                new:true
            }
        )
        return res.status(200).json(categoriaAtualizada);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarCategorias(req,res){
    try{
        const categorias = await Categoria.find({});
        return res.status(200).json(categorias);
    }catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarCategoria(req,res,next){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    const categoriaEncontrado = await Categoria.findOne({_id:id});
    if(categoriaEncontrado) {
        req.categoria = categoriaEncontrado;
        return next();
    }else return res.status(404).json({msg:"Categoria não encontrada"});
}

async function exibirCategoria(req,res){
    return res.status(200).json(req.categoria);
}

async function deletarCategoria(req,res){
    const { id } = req.params;
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Parâmetro inválido" });
        const livrosAlterados = await Livro.updateMany({ categoria: id }, { $set: { categoria: null } });
        const categoriaDeletada = await Categoria.findOneAndDelete({_id:id});
        return res.status(204).json({});
    }catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = {adicionarCategoria, editarCategoria, listarCategorias, buscarCategoria, exibirCategoria, deletarCategoria}
