const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/livro/categoria';

let id = null;

describe('Testes das rotas de categoria', ()=>{
    

    test('POST:422 nome inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":null
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Nome da categoria é obrigatória");
    });

    test('POST:201', async ()=>{
        const resposta = await request.post(url).send({
            "nome":"Literatura" 
        })
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.nome).toBe("Literatura");
        id = resposta.body._id;
    });

    test('GET:200', async()=>{
        const resposta = await request.get(url);
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
        expect(resposta.headers['content-type']).toMatch(/json/);
    });

    test('GET:id:400 id inválido', async()=>{
        const resposta = await request.get(`${url}/0`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/000000000000000000000000`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Literatura");
    });

    test('PUT:id:400 id inválido', async()=>{
        const resposta = await request.put(`${url}/0`).send({
            "nome":"Literatura"
        });
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('PUT:id:404 id não encontrado', async()=>{
        const resposta = await request.put(`${url}/000000000000000000000000`).send({
            "nome":"Literatura"
        });
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });

    test('PUT:id:200', async()=>{
        const resposta = await request.put(`${url}/${id}`).send({
            "nome":"Literatura" 
        });
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Literatura");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Literatura");
    });

    test('DELETE:id:400 id inválido', async()=>{
        const resposta = await request.delete(`${url}/0`)
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('DELETE:id:404 id não encontrado', async()=>{
        const resposta = await request.delete(`${url}/000000000000000000000000`)
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });

    test('DELETE:id:200', async()=>{
        const resposta = await request.delete(`${url}/${id}`)
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });
});

