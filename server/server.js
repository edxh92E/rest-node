require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Habilitar la carpeta public para que se pueda acceder desde cualquier lugar
app.use( express.static( path.resolve(__dirname,'../public')));
// Configuracion global de rutas
app.use(require('./routes/index'));

const PORT = 3000;



mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true, useCreateIndex: true }, (error, res) => {
    if (error) throw error;
    console.log('base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${process.env.PORT}`);
});