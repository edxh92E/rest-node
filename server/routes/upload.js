const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');


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

        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
    });

});

module.exports = app;