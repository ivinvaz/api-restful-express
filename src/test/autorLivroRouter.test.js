const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/livro/autor';

let id = null;
let token = null;

describe('Testes das rotas de autor', ()=>{
    
    test('MOCK POST:201', async()=>{
        const resposta = await request.post("/api/v1/usuario").send({
            "nome":"Jose",
            "email":"vaz@gmail.com",
            "senha":"senha"
        });
    })

    test('MOCK POST:200', async()=>{
        const resposta = await request.post("/api/v1/usuario/login").send({
            "email":"vaz@gmail.com",
            "senha":"senha"
        });
        usuario = resposta.headers.token;
    })

    test('POST:422 nome inexistente', async ()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).post(url).send({
            "nome":null,
            "idade":"abc",
            "nacionalidade":"Brasileiro"  
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Nome do autor é obrigatório");
    });

    test('POST:422 idade incorreta', async ()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).post(url).send({
            "nome":"Axe Of Assis",
            "idade":"abc",
            "nacionalidade":"Brasileiro"  
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Idade não é um número válido");
    });

    test('POST:422 idade inexistente', async ()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).post(url).send({
            "nome":"Axe Of Assis",
            "idade":null,
            "nacionalidade":"Brasileiro"  
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Idade do autor é obrigatória");
    });

    test('POST:201', async ()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).post(url).send({
            "nome":"Axe Of Assis",
            "idade":24,
            "nacionalidade":"Brasileiro"  
        })
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.nome).toBe("Axe Of Assis");
        expect(resposta.body.idade).toBe(24);
        expect(resposta.body.nacionalidade).toBe("Brasileiro");
        id = resposta.body._id;
    });

    test('GET:200', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).get(url);
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
        expect(resposta.headers['content-type']).toMatch(/json/);
    });

    test('GET:id:400 id inválido', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).get(`${url}/0`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).get(`${url}/000000000000000000000000`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Autor não encontrado");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Axe Of Assis");
        expect(resposta.body.idade).toBe(24);
        expect(resposta.body.nacionalidade).toBe("Brasileiro");
    });

    test('PUT:id:400 id inválido', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).put(`${url}/0`).send({
            "nome":"Axe Of Assis",
            "idade":34,
            "nacionalidade":"Brasileiro"  
        });
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('PUT:id:404 id não encontrado', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).put(`${url}/000000000000000000000000`).send({
            "nome":"Axe Of Assis",
            "idade":34,
            "nacionalidade":"Brasileiro"  
        });
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Autor não encontrado");
    });

    test('PUT:id:200', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).put(`${url}/${id}`).send({
            "nome":"Axe Of Assis",
            "idade":34,
            "nacionalidade":"Brasileiro"  
        });
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Axe Of Assis");
        expect(resposta.body.idade).toBe(34);
        expect(resposta.body.nacionalidade).toBe("Brasileiro");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Axe Of Assis");
        expect(resposta.body.idade).toBe(34);
        expect(resposta.body.nacionalidade).toBe("Brasileiro");
    });

    test('DELETE:id:400 id inválido', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).delete(`${url}/0`)
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('DELETE:id:404 id não encontrado', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).delete(`${url}/000000000000000000000000`)
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Autor não encontrado");
    });

    test('DELETE:id:200', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).delete(`${url}/${id}`)
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.set("authorization",`Bearer ${token}`).get(`${url}/${id}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Autor não encontrado");
    });
});

