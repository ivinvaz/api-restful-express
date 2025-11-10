const mongoose = require('mongoose');
const Livro = require('../models/livroModel');
const Autor = require('../models/autorModel');
const Categoria = require('../models/categoriaModel');
const Estoque = require('../models/estoqueModel');

async function adicionarLivro(req,res){
    try{
        let autorEncontrado = null;
        let categoriaEncontrada = null;
        if(req.body.autor){
            autorEncontrado = await Autor.findOne({nome:req.body.autor});
            if(!autorEncontrado) return res.status(404).json({msg:"Autor não encontrado"});
        }
        if(req.body.categoria){
            categoriaEncontrada = await Categoria.findOne({nome:req.body.categoria});
            if(!categoriaEncontrada) return res.status(404).json({msg:"Categoria não encontrada"});
        } 
        const novoLivro = await Livro.create({
            nome: req.body.nome,
            paginas: req.body.paginas,
            autor: autorEncontrado?._id,
            categoria: categoriaEncontrada?._id
        });
        const livroPopulado = await Livro.findById(novoLivro._id).populate('autor').populate('categoria');
        return res.status(201).json(livroPopulado);

    }catch (err) {
        if (err.name === 'CastError' && err.path === 'paginas') {
            return res.status(422).json({ msg: ['Paginas não é um número válido'] });
        }

        if (err.name === 'ValidationError') {

            const castErrorMsg = Object.values(err.errors)
            .filter(e => e.name === 'CastError' && e.path === 'paginas')
            .map(() => 'Paginas não é um número válido');

            if (castErrorMsg.length > 0) {
                return res.status(422).json({ msg: castErrorMsg });
            }

            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarLivro(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});
    try{
        let autorEncontrado = null;
        let categoriaEncontrada = null;
        if(req.body.autor){
            autorEncontrado = await Autor.findOne({nome:req.body.autor})
            if(!autorEncontrado) return res.status(404).json({msg:"Autor não encontrado"});
        }
        if(req.body.categoria){
            categoriaEncontrada = await Categoria.findOne({nome:req.body.categoria})
            if(!categoriaEncontrada) return res.status(404).json({msg:"Categoria não encontrada"});
        } 
        const livroAtualizado = await Livro.findOneAndUpdate(
            {
                _id:id
            },
            {
                nome: req.body.nome,
                paginas: req.body.paginas,
                autor: autorEncontrado?._id,
                categoria: categoriaEncontrada?._id
            },
            {
                runValidators: true, 
                new:true   
            }
        ).populate('autor').populate('categoria');
        return res.status(200).json(livroAtualizado);
    }catch (err) {
        if (err.name === 'ValidationError') {
          const mensagens = Object.values(err.errors).map(e => e.message);
          return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarLivros(req,res){
    try{
        const livros = await Livro.find({}).populate('autor').populate('categoria');
        return res.status(200).json(livros);    
    }catch(err){
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarLivro(req,res,next){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    const livroEncontrado = await Livro.findOne({_id:id}).populate('autor').populate('categoria');
    if(livroEncontrado){
        req.livro = livroEncontrado;
        return next();
    }else{
        return res.status(404).json({msg:"Livro não encontrado"})
    }
}

async function exibirLivro(req,res){
    return res.status(200).json(req.livro);
}

async function deletarLivro(req,res){
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Parâmetro inválido"});

    try{
        const estoquesDeletados = await Estoque.deleteMany({ livro: id });
        const livroDeletado = await Livro.findOneAndDelete({_id:id});
        return res.status(204).json({});
    }catch(err){
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { adicionarLivro, editarLivro, listarLivros, buscarLivro, exibirLivro, deletarLivro};
