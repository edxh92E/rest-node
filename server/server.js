require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

const PORT = 3000;



mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true, useCreateIndex: true }, (error, res) => {
    if (error) throw error;
    console.log('base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${process.env.PORT}`);
});