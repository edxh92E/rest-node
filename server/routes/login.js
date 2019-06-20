const Usuario = require('../models/usuario');
const express = require('express');
const bcrypt = require('bcrypt');

app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuario) => {

        if(error) {
            return res.status(500).json({
                ok: false,
                err: error
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contrasenia incorrectos'
                }
            });
        }

        if ( !bcrypt.compareSync( body.password, usuario.password )) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contrasenia incorrectos'
                }
            });

        }
        res.json({
            ok: true,
            usuario,
            token: '123'
        })
    });

});

module.exports = app;