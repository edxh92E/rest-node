/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;


// =============
// Entorno
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;


// =============
// Vencimiento token
// 60 segundo 60 minutos, 24 horas, 30 dias
// =============
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =============
// Seed de autenticacion
// =============
process.env.SEED = process.env.SEED || 'sitio-desarrollo';


// =============
// Google client
// =============

process.env.CLIENT_ID = process.env.CLIENT_ID || '747989388698-en8vvrf9ball14hp363baufmgmttko3k.apps.googleusercontent.com';