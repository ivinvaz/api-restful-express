const jwt = require('jsonwebtoken');

function verificarTokenDeAutentificacao(req,res,next){
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader)  return res.status(401).json({ msg: 'Token ausente' });
    try{  
        let payload = null;
        if (authHeader.includes('Bearer ')) {
            const token = authHeader.split(" ")[1];
            payload = jwt.verify(token, process.env.JWT_SEGREDO);
        } else {
            payload = jwt.verify(authHeader, process.env.JWT_SEGREDO);
        }
        req.payload = {
            iss: payload.iss,
            aud: payload.aud,
            email: payload.email,
            nome: payload.nome
        };
        next();
    }catch(err){
        res.status(401).json({msg:"Token inválido "});
    }
}

function gerarTokenDeAutentificacao(payload){
    try{
        const expiresIn = "30m";
        const token = jwt.sign(payload,process.env.JWT_SEGREDO, { expiresIn });
        return token;
    }catch(err){
        throw Error("Erro ao gerar token");
    }
}

function renovarTokenDeAutentificacao(req,res){
    try{
        const payload = req.payload;
        res.json({token:gerarTokenDeAutentificacao(payload)})
    }catch(err){
        return res.status(500).json({msg:"Erro ao renovar token"});
    }
}

module.exports = {verificarTokenDeAutentificacao, gerarTokenDeAutentificacao, renovarTokenDeAutentificacao};
