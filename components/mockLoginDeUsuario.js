
async function mockarLoginDeUsuario(){
    const registro = await request.post("/api/v1/usuario").send({
        "nome":"Jose",
        "email":"vaz@gmail.com",
        "senha":"senha"
    });
    const login = await request.post("/api/v1/usuario/login").send({
        "email":"vaz@gmail.com",
        "senha":"senha"
    });
    return login.headers.token;
}