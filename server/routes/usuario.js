const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

app = express();

app.get('/usuario', (req, res) => {
    res.json('Hola que haces');
});

app.post('/usuario', (req, res) => {
    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save( (error, usuarioDB) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                err: error
            })
        }

        // usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});


app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Usuario.findById(id, (err, usuarioDB) => {
    // usuarioDB.save();

    // Usuario.findByIdAndUpdate(id, body, {new: true}, (error, usuarioDB) => {
    Usuario.findOneAndUpdate(id, body, {new: true}, (error, usuarioDB) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                err: error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });
});

module.exports = app;