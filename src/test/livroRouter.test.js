const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/livro';
const urlAutor = '/api/v1/livro/autor';
const urlCategoria = '/api/v1/livro/categoria';

let id = null;


describe('Testes das rotas de livro', ()=>{
    
    test('MOCK Autor', async ()=>{
        const resposta = await request.post(urlAutor).send({
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
    });

    test('MOCK Categoria', async ()=>{
        const resposta = await request.post(urlCategoria).send({
            "nome":"Literatura" 
        })
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.nome).toBe("Literatura");
    });

    test('POST:422 nome inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":null,
            "paginas":10,
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Nome do livro é obrigatório");
    });

    test('POST:422 paginas inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":"Memórias do Brás",
            "paginas":null,
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Quantidade de páginas do livro é obrigatório");
    });

    test('POST:422 paginas incorreta', async ()=>{
        const resposta = await request.post(url).send({
            "nome":"Memorias do Brás",
            "paginas":"abc",
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        })
        expect(resposta.status).toBe(422);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Paginas não é um número válido");
    });

    test('POST:404 autor inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":"Memorias do Brás",
            "paginas":"abc",
            "autor":"Joao Pessoa",
            "categoria":"Literatura"  
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Autor não encontrado");
    });

    test('POST:404 categoria inexistente', async ()=>{
        const resposta = await request.post(url).send({
            "nome":"Memorias do Brás",
            "paginas":"abc",
            "autor":"Joao Pessoa",
            "categoria":"Literatura"  
        })
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });

    test('POST:201', async ()=>{
        const resposta = await request.post(url).send({
            "nome":"Memorias do Brás",
            "paginas":24,
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        })
        expect(resposta.status).toBe(201);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.nome).toBe("Memorias do Brás");
        expect(resposta.body.paginas).toBe(24);
        expect(resposta.body.autor.nome).toBe("Axe of Assis");
        expect(resposta.body.categoria.nome).toBe("Literatura");
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
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Memorias do Brás");
        expect(resposta.body.paginas).toBe(24);
        expect(resposta.body.autor.nome).toBe("Axe of Assis");
        expect(resposta.body.categoria.nome).toBe("Literatura");
    });

    test('PUT:id:400 id inválido', async()=>{
        const resposta = await request.put(`${url}/0`).send({
            "nome":"Memorias do Brás",
            "paginas":34,
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        });
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });
    
    test('PUT:id:404 id não encontrado', async()=>{
        const resposta = await request.put(`${url}/000000000000000000000000`).send({
            "nome":"Memorias do Brás",
            "paginas":34,
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        });
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('PUT:id:200', async()=>{
        const resposta = await request.put(`${url}/${id}`).send({
            "nome":"Memorias do Brás",
            "paginas":34,
            "autor":"Axe of Assis",
            "categoria":"Literatura"  
        });
        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Memorias do Brás");
        expect(resposta.body.paginas).toBe(34);
        expect(resposta.body.autor.nome).toBe("Axe of Assis");
        expect(resposta.body.categoria.nome).toBe("Literatura");
    });

    test('GET:id:200', async ()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.nome).toBe("Memorias do Brás");
        expect(resposta.body.paginas).toBe(34);
        expect(resposta.body.autor.nome).toBe("Axe of Assis");
        expect(resposta.body.categoria.nome).toBe("Literatura");
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
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });

    test('DELETE:id:200 id não encontrado', async()=>{
        const resposta = await request.delete(`${url}/${id}`)
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 id não encontrado', async()=>{
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(404);
        expect(resposta.headers['content-type']).toMatch(/json/);
        expect(resposta.body.msg).toContain("Livro não encontrado");
    });
});

