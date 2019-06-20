const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');

const client = new OAuth2Client(process.env.CLIENT_ID);

app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuario) => {

        if (error) {
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

        if (!bcrypt.compareSync(body.password, usuario.password)) {

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


// configuraciones de google 


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        img: payload.picture,
        email: payload.email,
        google: true
    }

}
// verify().catch(console.error);


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(error => {
        return res.status(403).json({
            ok: false,
            error: error
        });
    })

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error: error
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: 'Debe de usar su autenticacion normal'
                });
            } else {

                let token = jwt.sign({
                    usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            }
        } else { // si el usuario no existe en la base de datos

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save((error, usuarioDB) => {

                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error: error
                    });
                }

                let token = jwt.sign({
                    usuario,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            });
        }

    })

});

module.exports = app;