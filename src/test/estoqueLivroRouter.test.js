const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/estoque';

let id = null;

describe('Testes das rotas de estoque', ()=>{

    test('POST:422 livro inexistente', async ()=>{
    });

    test('POST:422 quantidade inexistente', async ()=>{
    });

    test('POST:422 tamanho inexistente', async ()=>{
    });

    test('POST:422 preco inexistente', async ()=>{
    });

    test('POST:404 livro não encontrado', async ()=>{
    });

    test('POST:404 tamanho não encontrado', async ()=>{
    });

    test('POST:201', async ()=>{
    });

    test('GET:200', async ()=>{
    });

    test('GET:id:400 id inválido', async ()=>{
    });

    test('GET:id:404 id não encontrado', async ()=>{
    });

    test('GET:id:200', async ()=>{
    });

    test('PUT:id:400 id inválido', async ()=>{
    });

    test('PUT:id:404 id não encontrado', async ()=>{
    });

    test('PUT:id:404 livro não encontrado', async ()=>{
    });

    test('PUT:id:404 tamanho não encontrado', async ()=>{
    });

    test('PUT:id:200', async ()=>{
    });

    test('DELETE:id:400 id inválido', async ()=>{
    });

    test('DELETE:id:404 id não encontrado', async ()=>{
    });

    test('DELETE:id:204', async ()=>{
    });

    test('GET:id:404 estoque não encontrado', async ()=>{
    });
});
