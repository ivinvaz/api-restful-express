const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/livro/estoque';
const urlTamanho = '/api/v1/livro/tamanho';
const urlLivro = '/api/v1/livro';

let id = null;
let token = null;

const tempo = Date.now();
const numeroAleatorio = Math.floor(Math.random() * 1000);
let nomeUser = `nomeUserTest${tempo}`;
let emailUser = `emailUserTest${tempo}@gmail.com`;
let senhaUser = `senhaUserTest${tempo}`;
let livro = `livroTest${tempo}`;
let quantidade = numeroAleatorio;
let tamanho = `autorTest${tempo}`;
let preco = numeroAleatorio;

describe('Testes das rotas de estoque', ()=>{

    beforeAll(async () => {
        await request.post("/api/v1/usuario").send({
            "nome":nomeUser,
            "email":emailUser,
            "senha":senhaUser
        });
    
        const mockLogin = await request.post("/api/v1/usuario/login").send({
            "email":emailUser,
            "senha":senhaUser
        });
        
        expect(mockLogin.status).toBe(200);
        expect(mockLogin.body.token).toBeDefined();
        token = mockLogin.body.token;

        const mockTamanho = await request.post(urlTamanho).set("authorization",`Bearer ${token}`).send({
            "nome":tamanho
        })
        expect(mockTamanho.status).toBe(201);

        const mockLivro = await request.post(urlLivro).set("authorization",`Bearer ${token}`).send({
            "nome":livro,
            "paginas":250,
            "autor":null,
            "categoria":null
        })
        expect(mockLivro.status).toBe(201);

    });

    test('POST:422 livro inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":null,
            "quantidade":quantidade,
            "tamanho":tamanho,
            "preco":preco
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro é obrigatório");
    });

    test('POST:422 quantidade inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":null,
            "tamanho":tamanho,
            "preco":preco
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Quantidade é obrigatória");
    });

    test('POST:422 tamanho inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":quantidade,
            "tamanho":null,
            "preco":preco
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Tamanho é obrigatório");
    });

    test('POST:422 preco inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":quantidade,
            "tamanho":tamanho,
            "preco":null
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Preço é obrigatório");
    });

    test('POST:404 livro não encontrado', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":"Outro Livro",
            "quantidade":quantidade,
            "tamanho":tamanho,
            "preco":preco
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('POST:404 tamanho não encontrado', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":quantidade,
            "tamanho":"Outro Tamanho",
            "preco":preco
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Tamanho não encontrado");
    });

    test('POST:401 token ausente', async ()=>{
        const resposta = await request.post(url).send({
            "livro":livro,
            "quantidade":quantidade,
            "tamanho":tamanho,
            "preco":preco
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('POST:201', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":quantidade,
            "tamanho":tamanho,
            "preco":preco
        });
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.livro).toBe(livro);
        expect(resposta.body.quantidade).toBe(1);
        expect(resposta.body.tamanho).toBe(tamanho);
        expect(resposta.body.preco).toBe(preco);
        id = resposta.body._id;
    });

    test('GET:200', async ()=>{
        const resposta = await request.get(url);
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
        expect(resposta.headers['content-type']).toMatch(/json/);
    });

    test('GET:id:400 id inválido', async ()=>{
        const resposta = await request.get(`${url}/0`);
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });

    test('GET:id:404 id não encontrado', async ()=>{
        const resposta = await request.get(`${url}/000000000000000000000000`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Estoque não encontrado");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.status).toBe(200);
        expect(resposta.body.livro).toBe(livro);
        expect(resposta.body.quantidade).toBe(1);
        expect(resposta.body.tamanho).toBe(tamanho);
        expect(resposta.body.preco).toBe(preco);
    });

    test('PUT:id:400 id inválido', async ()=>{
        const resposta = await request.put(`${url}/0`).send({
            "livro":livro,
            "quantidade":quantidade+1,
            "tamanho":tamanho,
            "preco":preco
        });
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });

    test('PUT:id:404 id não encontrado', async ()=>{
        const resposta = await request.put(`${url}/000000000000000000000000`).send({
            "livro":livro,
            "quantidade":quantidade+1,
            "tamanho":tamanho,
            "preco":preco
        });
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Estoque não encontrado");
    });

    test('PUT:id:404 livro não encontrado', async ()=>{
        const resposta = await request.put(url).set("authorization",`Bearer ${token}`).send({
            "livro":"Outro Livro",
            "quantidade":quantidade+1,
            "tamanho":tamanho,
            "preco":preco
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('PUT:id:404 tamanho não encontrado', async ()=>{
        const resposta = await request.put(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":quantidade+1,
            "tamanho":"Outro Tamanho",
            "preco":preco
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Tamanho não encontrado");
    });

    test('PUT:id:401 token ausente', async ()=>{
        const resposta = await request.put(url).send({
            "livro":livro,
            "quantidade":quantidade+1,
            "tamanho":tamanho,
            "preco":preco
        })
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('PUT:id:200', async ()=>{
        const resposta = await request.put(url).set("authorization",`Bearer ${token}`).send({
            "livro":livro,
            "quantidade":quantidade+1,
            "tamanho":tamanho,
            "preco":preco
        })
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.status).toBe(200);
        expect(resposta.body.livro).toBe(livro);
        expect(resposta.body.quantidade).toBe(quantidade+1);
        expect(resposta.body.tamanho).toBe(tamanho);
        expect(resposta.body.preco).toBe(preco);
    });

    test('DELETE:id:400 id inválido', async ()=>{
        const resposta = await request.delete(`${url}/0`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });

    test('DELETE:id:404 id não encontrado', async ()=>{
        const resposta = await request.delete(`${url}/000000000000000000000000`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Estoque não encontrado");
    });

    test('DELETE:id:401 token ausente', async ()=>{
        const resposta = await request.delete(`${url}/${id}`);
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('DELETE:id:204', async ()=>{
        const resposta = await request.delete(`${url}/${id}`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 estoque não encontrado', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Estoque não encontrado");
    });
});



