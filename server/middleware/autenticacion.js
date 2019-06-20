const jwt = require('jsonwebtoken');

// Verificar Token

let verificaToken = ( req, res, next ) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (error, decode) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                error: error
            });
        }

        // payload del JWT
        req.usuario = decode.usuario;
        next();

    })

};


module.exports = {
    verificaToken
}
