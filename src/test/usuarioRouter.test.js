const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/usuario';
const urlLogin = '/api/v1/usuario/login'
const urlRenovar = '/api/v1/usuario/renovar'

let id = null;
let token = null;

const tempo = Date.now();
const numeroAleatorio = Math.floor(Math.random() * 1000);
let nomeUser = `nomeUserTest${tempo}`;
let emailUser = `emailUserTest${tempo}@gmail.com`;
let senhaUser = `senhaUserTest${tempo}`;
let nome = `nomeTest${tempo}`;
let email = `emailTest${tempo}@gmail.com`;
let senha = `senhaTest${tempo}`;

describe('Testes das rotas de usuario', ()=>{
    
    beforeAll(async () => {
        await request.post("/api/v1/usuario").send({
            "nome":nomeUser,
            "email":emailUser,
            "senha":senhaUser
        });
    
        const resposta = await request.post(urlLogin).send({
            "email":emailUser,
            "senha":senhaUser
        });
        
        expect(resposta.status).toBe(200);
        expect(resposta.body.token).toBeDefined();
        token = resposta.body.token;
    });

    test('POST:422 nome inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":null,
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain('Nome é obrigatório');
    });

    test('POST:422 email inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":nome,
            "email":null,
            "senha":senha
        });
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain('Email é obrigatório');
    });
    
    test('POST:422 senha inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":nome,
            "email":email,
            "senha":null
        });
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain('Senha é obrigatória');
    });

    test('POST:201', async ()=>{
        const resposta = await request.post(url).send({
            "nome":nome,
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toMatch(nome);
        expect(resposta.body.email).toMatch(email);
        id = resposta.body._id;
    });

    test('GET:200', async()=>{
        const resposta = await request.get(url).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
        expect(resposta.headers['content-type']).toMatch(/json/);
    });

    test('GET:id:400 id inválido', async()=>{
        const resposta = await request.get(`${url}/0`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/000000000000000000000000`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Usuário não encontrado");
    });

    test('GET:id:401 token ausente', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.email).toBe(email);
    });

    test('PUT:id:400 id inválido', async()=>{
        const resposta = await request.put(`${url}/0`).set("authorization",`Bearer ${token}`).send({
            "nome":`${nome}2`,
            "email":email,
            "senha":senha
        });;
        expect(resposta.status).toBe(400);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('PUT:id:404 id não encontrado', async()=>{
        const resposta = await request.put(`${url}/000000000000000000000000`).set("authorization",`Bearer ${token}`).send({
            "nome":`${nome}2`,
            "email":email,
            "senha":senha
        });;
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Usuário não encontrado");
    });

    test('PUT:id:401 token ausente', async()=>{
        const resposta = await request.put(`${url}/${id}`).send({
            "nome":`${nome}2`,
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('PUT:id:200', async()=>{
        const resposta = await request.put(`${url}/${id}`).set("authorization",`Bearer ${token}`).send({
            "nome":`${nome}2`,
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toMatch(`${nome}2`);
        expect(resposta.body.email).toMatch(email);
        id = resposta.body._id;
    });

    test('/login POST:401 email incorreto', async ()=>{
        const resposta = await request.post(urlLogin).send({
            "email":"email@gmail.com",
            "senha":senha
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Credenciais inválidas");
    });

    test('/login POST:401 senha incorreta', async ()=>{
        const resposta = await request.post(urlLogin).send({
            "email":email,
            "senha":"senha"
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Credenciais inválidas");
    });

    test('/login POST:200', async ()=>{
        const resposta = await request.post(urlLogin).send({
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(200);
        expect(resposta.body.token).toBeDefined();
    });

    test('/renovar POST:401 email incorreto', async ()=>{
        const resposta = await request.post(urlRenovar).set("authorization",`Bearer ${token}`).send({
            "email":"email@gmail.com",
            "senha":senha
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Credenciais inválidas");
    });

    test('/renovar POST:401 senha incorreta', async ()=>{
        const resposta = await request.post(urlRenovar).set("authorization",`Bearer ${token}`).send({
            "email":email,
            "senha":"senha"
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Credenciais inválidas");
    });

    test('/renovar POST:401 token ausente', async ()=>{
        const resposta = await request.post(urlRenovar).send({
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('/renovar POST:200', async ()=>{
        const resposta = await request.post(urlRenovar).set("authorization",`Bearer ${token}`).send({
            "email":email,
            "senha":senha
        });
        expect(resposta.status).toBe(200);
        expect(resposta.body.token).toBeDefined();
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
        expect(resposta.body.msg).toContain("Usuário não encontrado");
    });

    test('DELETE:id:401 token ausente', async()=>{
        const resposta = await request.delete(`${url}/${id}`);
        expect(resposta.status).toBe(401);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('DELETE:id:204', async()=>{
        const resposta = await request.delete(`${url}/${id}`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/${id}`).set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Usuário não encontrado");
    });
});
