const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/usuario';
const urlLogin = '/api/v1/usuario/login'
const urlRenovar = '/api/v1/usuario/renovar'

let id = null;

describe('Testes das rotas de autor', ()=>{
    

    test('POST:422 nome inexistente', async ()=>{
    });

    test('POST:422 email inexistente', async ()=>{
    });
    
    test('POST:422 senha inexistente', async ()=>{
    });

    test('POST:201', async ()=>{
    });

    test('GET:200', async()=>{
    });

    test('GET:id:400 id inválido', async()=>{
    });
    
    test('GET:id:404 id não encontrado', async()=>{
    });

    test('GET:id:200', async ()=>{
    });

    test('PUT:id:400 id inválido', async()=>{
    });
    
    test('PUT:id:404 id não encontrado', async()=>{
    });

    test('PUT:id:200', async()=>{
    });

    test('GET:id:200', async ()=>{
    });

    test('/login POST:422 nome incorreta', async ()=>{
    });

    test('/login POST:422 email incorreta', async ()=>{
    });

    test('/login POST:422 senha incorreta', async ()=>{
    });

    test('/login POST:201', async ()=>{
    });
    
    test('/renovar POST:422 nome incorreta', async ()=>{
    });

    test('/renovar POST:422 email incorreta', async ()=>{
    });

    test('/renovar POST:422 senha incorreta', async ()=>{
    });

    test('/renovar POST:201', async ()=>{
    });

    test('DELETE:id:400 id inválido', async()=>{
    });
    
    test('DELETE:id:404 id não encontrado', async()=>{
    });

    test('DELETE:id:200 id não encontrado', async()=>{
    });

    test('GET:id:404 id não encontrado', async()=>{
    });
});
