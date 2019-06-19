const express = require('express');
const Usuario = require('../models/usuario');
app = express();

app.get('/usuario', (req, res) => {
    res.json('Hola que haces');
});

app.post('/usuario', (req, res) => {
    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });


    usuario.save( (error, usuarioDB) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                err: error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});


app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let respuesta = {
        id
    }
    res.json(respuesta);
});

module.exports = app;