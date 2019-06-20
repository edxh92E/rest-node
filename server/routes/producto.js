const express = require('express');

const { verificaToken } = require('../middleware/autenticacion')

const app = express();
let Producto = require('../models/producto');

// Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true})
        .skip(desde).limit(limite)
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((error, productos) => {

            if( error) {
                return res.status(500).json({
                    ok: false,
                    error: error
                })
            }

            res.json({
                ok: true,
                productos
            });

        })
});


// Obtener un producto por ID
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre')
            .populate('categoria', 'descripcion')
            .exec((error, productoDB) => {
                if( error) {
                    return res.status(500).json({
                        ok: false,
                        error: error
                    })
                }

                if(!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: ' NO existe el producto'
                        }
                    })
                }

                res.json({
                    ok: true,
                    producto: productoDB
                })
    })
})


// Busquedas
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .populate('categoria', 'nombre')
            .exec( (error, productos) => {
                if( error) {
                    return res.status(500).json({
                        ok: false,
                        error: error
                    })
                }

                res.json({
                    ok: true,
                    productos
                })
            })

});
// Obtener un producto por ID
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario.id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save(( error, productoDB) => {

        if( error) {
            return res.status(500).json({
                ok: false,
                error: error
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
})

// Actualizar un producto por ID
app.put('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error: error
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        
        productoDB.save((error, productoGuardado) => {
            if(error) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'El producto no existe'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
});

app.delete('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    Producto.findById(id, (error, productoDB) => {

        if(error) {
            return res.status(500).json({
                ok: false,
                error: error
            })
        }

        if(!productoDB) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                }
            })
        }

        productoDB.disponible = false;
        productoDB.save((error, productoBorrado) => {
            if(error) {
                return res.status(500).json({
                    ok: false,
                    error: error
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: "Producto borrado"
            })
        })

    })
});
module.exports = app;