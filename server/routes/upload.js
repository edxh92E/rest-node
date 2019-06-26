const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) <0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo no es permitido: ' + tiposValidos.join(","),
            }
        });
    }



    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    // FIXME: extensiones permitidas para los archivos

    
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    
    if(extensionesValidas.indexOf(extension) <0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'el formato no es valido, extensiones validas: ' + extensionesValidas.join(","),
                extension
            }
        });
    }

    // cambiar nombre al archivo 
    let nombreArchvio = `${id}-${ new Date().getMilliseconds() }-.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchvio}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchvio);
        } else {
            imagenProducto(id, res, nombreArchvio);
        }
    });

});

function imagenUsuario(id, res, nombreArchvio) {

    Usuario.findById(id, (error, usuarioDB) => {
        if(error) {
            // borrarmos 
            borrarArchivo(nombreArchvio, 'usuarios');
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no existe'
                } 
            })
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchvio;
        usuarioDB.save((error, usuarioGuardado) => {
            if (error){
                return res.status(500).json({
                        ok: false,
                        error
                    }) 
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchvio
            })
        });



    })
}

function imagenProducto(id, res, nombreArchvio) {

    Producto.findById(id, (error, productoDB) => {
        if(error) {
            // borrarmos 
            borrarArchivo(nombreArchvio, 'productos');
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                } 
            })
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchvio;
        productoDB.save((error, productoGuardado) => {
            if (error){
                return res.status(500).json({
                        ok: false,
                        error
                    }) 
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchvio
            })
        });



    });
}

function borrarArchivo(nombreArchvio, tipo) {
    // Verificamos la ruta del archivo
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchvio}`); 
    // funcion que determina si existe un archivo esta no es asincrona
    if(fs.existsSync(pathImagen)) {
        // borrando archivo 
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;