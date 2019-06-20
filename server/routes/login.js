const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
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

        let token = jwt.sign({
            usuario,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario,
            token
        })
    });

});

module.exports = app;