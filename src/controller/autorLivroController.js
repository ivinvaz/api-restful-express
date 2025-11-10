const mongoose = require('mongoose');
const Autor = require('../models/autorModel');
const Livro = require('../models/livroModel');

async function adicionarAutor(req,res){
    try{
        const novoAutor = await Autor.create({
            nome: req.body.nome,
            idade: req.body.idade,
            nacionalidade: req.body.nacionalidade
        });
        return res.status(201).json(novoAutor);
    }catch (err) {
            
    if (err.name === 'CastError' && err.path === 'idade') {
        return res.status(422).json({ msg: ['Idade não é um número válido'] });
    }
    
    if (err.name === 'ValidationError') {
      
      const castErrorMsg = Object.values(err.errors)
        .filter(e => e.name === 'CastError' && e.path === 'idade')
        .map(() => 'Idade não é um número válido');

      if (castErrorMsg.length > 0) {
        return res.status(422).json({ msg: castErrorMsg });
      }

      const mensagens = Object.values(err.errors).map(e => e.message);
      return res.status(422).json({ msg: mensagens });
    }
    
    return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarAutor(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});
    try{
        const autorAtualizado = await Autor.findOneAndUpdate(
            {
                _id:id
            },
            {
                nome: req.body.nome,
                idade: req.body.idade,
                nacionalidade: req.body.nacionalidade
            },
            {
                runValidators: true, 
                new:true
            }
        )
        return res.status(200).json(autorAtualizado);        
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        if (err.name === 'CastError' && err.path === 'idade') {
            return res.status(422).json({ msg: ['Idade não é um número válido'] });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarAutores(req,res){
    try{
        autoresListados = await Autor.find({});
        return res.status(200).json(autoresListados);        
    }catch(err){
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarAutor(req,res,next){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    autorEncontrado = await Autor.findOne({_id:id});
    if(autorEncontrado) {
        req.autor = autorEncontrado;
        return next();
    }else return res.status(404).json({msg:"Autor não encontrado"});
}

async function exibirAutor(req,res){
    return res.status(200).json(req.autor);
}

async function deletarAutor(req,res){
    const { id } = req.params;
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Parâmetro inválido" });
        const livrosAlterados = await Livro.updateMany({ autor: id }, { $set: { autor: null } });
        const autorRemovido = await Autor.findOneAndDelete({_id: id});
        return res.status(204).json({});
    }catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }

}

module.exports = { adicionarAutor, editarAutor, listarAutores, buscarAutor, exibirAutor, deletarAutor};
