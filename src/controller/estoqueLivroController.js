const mongoose = require('mongoose');
const Livro = require('../models/livroModel');
const Estoque = require('../models/estoqueModel');
const Tamanho = require('../models/tamanhoModel');

// POST - cria um novo estoque >necessário autentificação< 
async function adicionarEstoque(req,res){
    try{
        let livroEncontrado = null;
        let tamanhoEncontrado = null;
        if(req.body.livro){
            livroEncontrado = await Livro.findOne({nome:req.body.livro});
            if(!livroEncontrado) return res.status(404).json({msg:"Livro não encontrado"});
        }
        if(req.body.tamanho){
            tamanhoEncontrado = await Tamanho.findOne({nome:req.body.tamanho});
            if(!tamanhoEncontrado) return res.status(404).json({msg:"Tamanho não encontrada"});
        }
        const novoEstoque = await Estoque.create({
            livro: livroEncontrado?._id,
            quantidade: req.body.quantidade,
            tamanho: tamanhoEncontrado?._id,
            preco: req.body.preco
        });
        return res.status(201).json(novoEstoque)
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

// PUT/:id - edita um estoque >necessário autentificação<
async function editarEstoque(req,res){
    const { id } = req.params;
    try{
        let livroEncontrado = null;
        let tamanhoEncontrado = null;
        if(req.body.livro){
            livroEncontrado = await Livro.findOne({nome:req.body.livro});
            if(!livroEncontrado) return res.status(404).json({msg:"Livro não encontrado"});
        }
        if(req.body.tamanho){
            tamanhoEncontrado = await Tamanho.findOne({nome:req.body.tamanho});
            if(!tamanhoEncontrado) return res.status(404).json({msg:"Tamanho não encontrada"});
        }
        const estoqueAtualizado = await Estoque.findOneAndUpdate(
            {
                _id:id
            },
            {
                livro: livroEncontrado?._id,
                quantidade: req.body.quantidade,
                tamanho: tamanhoEncontrado?._id,
                preco: req.body.preco    
            },
            {
                runValidators: true, 
                new:true      
            }
        )
        return res.status(200).json(estoqueAtualizado);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

// GET - recebe todos os estoques
async function listarEstoque(req,res){
    const estoques = await Estoque.find({}).populate('livro').populate('tamanho');
    return res.status(200).json(estoques);
}

// GET/:id - recebe os dados do estoque e do livro 
async function buscarEstoques(req,res,next){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    const estoqueEncontrado = await Estoque.findOne({_id:id}).populate('livro').populate('tamanho');
    if (estoqueEncontrado){
        req.estoque = estoqueEncontrado;
        return next();
    }else{
        return res.status(404).json({msg:"Estoque não encontrado"});
    }
}

async function exibirEstoque(req,res){
    return res.status(200).json(req.estoque);
}

// DELETE - deleta o estoque >necessário autentificação<
async function deletarEstoque(req,res){
    const { id } = req.params;
    const estoqueDeletado = await Estoque.findOneAndDelete({_id:id});
    return res.status(204).json({});
}

module.exports = { adicionarEstoque, editarEstoque, listarEstoque, buscarEstoques, exibirEstoque, deletarEstoque};