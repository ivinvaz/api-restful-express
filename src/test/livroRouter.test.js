const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/livro';
const urlAutor = '/api/v1/livro/autor';
const urlCategoria = '/api/v1/livro/categoria';

let id = null;
let token = null;

const tempo = Date.now();
const numeroAleatorio = Math.floor(Math.random() * 1000);
let nomeUser = `nomeUserTest${tempo}`;
let emailUser = `emailUserTest${tempo}@gmail.com`;
let senhaUser = `senhaUserTest${tempo}`;
let nome = `nomeTest${tempo}`;
let paginas = numeroAleatorio;
let autor = `autorTest${tempo}`;
let categoria = `categoriaTest${tempo}`;

describe('Testes das rotas de livro', ()=>{
    
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

        const mockAutor = await request.post(urlAutor).set("authorization",`Bearer ${token}`).send({
            "nome":autor,
            "idade":paginas,
            "nacionalidade":"Brasileiro"  
        })
        expect(mockAutor.status).toBe(201);

        const mockCategoria = await request.post(urlCategoria).set("authorization",`Bearer ${token}`).send({
            "nome":categoria
        })
        expect(mockCategoria.status).toBe(201);
    });

    test('POST:422 nome inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "nome":null,
            "paginas":paginas,
            "autor":autor,
            "categoria":categoria 
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Nome do livro é obrigatório");
    });

    test('POST:422 paginas inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":null,
            "autor":autor,
            "categoria":categoria 
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Quantidade de páginas do livro é obrigatório");
    });

    test('POST:422 paginas incorreta', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":"abc",
            "autor":autor,
            "categoria":categoria 
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Paginas não é um número válido");
    });

    test('POST:404 autor inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":paginas,
            "autor":"Joao Pessoa",
            "categoria":categoria 
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Autor não encontrado");
    });

    test('POST:404 categoria inexistente', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":paginas,
            "autor":autor,
            "categoria":"Outra categoria" 
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });

    test('POST:401 token ausente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":nome,
            "paginas":paginas,
            "autor":autor,
            "categoria":categoria 
        })
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('POST:201', async ()=>{
        const resposta = await request.post(url).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":paginas,
            "autor":autor,
            "categoria":categoria 
        })
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.paginas).toBe(paginas);
        expect(resposta.body.autor.nome).toBe(autor);
        expect(resposta.body.categoria.nome).toBe(categoria);
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
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/000000000000000000000000`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.paginas).toBe(paginas);
        expect(resposta.body.autor.nome).toBe(autor);
        expect(resposta.body.categoria.nome).toBe(categoria);
    });

    test('PUT:id:400 id inválido', async()=>{
        const resposta = await request.put(`${url}/0`).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":paginas+1,
            "autor":autor,
            "categoria":categoria 
        });
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('PUT:id:404 id não encontrado', async()=>{
        const resposta = await request.put(`${url}/000000000000000000000000`).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":paginas+1,
            "autor":autor,
            "categoria":categoria 
        });
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('PUT:id:401 token ausente', async()=>{
        const resposta = await request.put(`${url}/${id}`).send({
            "nome":nome,
            "paginas":paginas+1,
            "autor":autor,
            "categoria":categoria 
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('PUT:id:200', async()=>{
        const resposta = await request.put(`${url}/${id}`).set("authorization",`Bearer ${token}`).send({
            "nome":nome,
            "paginas":paginas+1,
            "autor":autor,
            "categoria":categoria 
        });
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.paginas).toBe(paginas+1);
        expect(resposta.body.autor.nome).toBe(autor);
        expect(resposta.body.categoria.nome).toBe(categoria);
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.paginas).toBe(paginas+1);
        expect(resposta.body.autor.nome).toBe(autor);
        expect(resposta.body.categoria.nome).toBe(categoria);
    });

    test('DELETE:id:400 id inválido', async()=>{
        const resposta = await request.delete(`${url}/0`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('DELETE:id:404 id não encontrado', async()=>{
        const resposta = await request.delete(`${url}/000000000000000000000000`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('DELETE:id:401 token ausente', async()=>{
        const resposta = await request.delete(`${url}/${id}`);
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('DELETE:id:200', async()=>{
        const resposta = await request.delete(`${url}/${id}`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });
});