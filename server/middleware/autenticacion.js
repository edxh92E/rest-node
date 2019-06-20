const jwt = require('jsonwebtoken');

// Verificar Token

let verificaToken = ( req, res, next ) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (error, decode) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no valido'
                }
            });
        }

        // payload del JWT
        req.usuario = decode.usuario;
        next();

    })

};


// Verificar adminRole
let verificarRole = ( req, res, next ) => {
    let usuario = req.usuario;
    if ( usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: {
                message: 'No es un administrador'
            }
        })
    }

};
module.exports = {
    verificaToken,
    verificarRole
}
