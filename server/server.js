require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = 3000;

app.get('/usuario', (req, res) => {
    res.json('Hola que haces');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined){
        res.status(400).json({
                ok: false,
                mensaje: 'el nombre es necesario'
            });
    }
    res.json({
        persona: body
    });
});


app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let respuesta = {
        id
    }
    res.json(respuesta);
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${process.env.PORT}`);
});