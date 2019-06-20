const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificarRole } = require('../middleware/autenticacion');

app = express();

app.get('/usuario', verificaToken, (req, res) => {

    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
    });*/

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    
    // Usuario.find({}, 'nombre email role estado google img') // agregando exclusiones
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                err: error
            })
        }

        Usuario.count({estado: true}, (error, conteo) => {
            
            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            })

        });

        

    });
});

app.post('/usuario', [verificaToken, verificarRole], (req, res) => {
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


app.put('/usuario/:id', [verificaToken, verificarRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    


    // Usuario.findById(id, (err, usuarioDB) => {
    // usuarioDB.save();

    // Usuario.findByIdAndUpdate(id, body, {new: true}, (error, usuarioDB) => {
    Usuario.findOneAndUpdate(id, body, {new: true, runValidators: true}, (error, usuarioDB) => {

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

app.delete('/usuario/:id', [verificaToken, verificarRole], function (req, res) {

    let id = req.params.id;

    // Borrando fisicamente
    // Usuario.findByIdAndRemove(id, (error, usuarioDB) => {
    // Modificando estado del usuario para borrarlo
    Usuario.findOneAndUpdate(id, { estado: false }, {new: true}, (error, usuarioDB) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                err: error
            })
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

module.exports = app;