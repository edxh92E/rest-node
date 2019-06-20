const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


// default options
app.use(fileUpload());


app.put('/upload', function(req, res) {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado ningun archivo'
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
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${archivo.name}`, (err) => {
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