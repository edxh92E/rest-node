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
    urlDB = 'mongodb+srv://edxh92:zDVdepDQ5FRaktkB@cluster0-9pzq9.mongodb.net/test';
}

process.env.urlDB = urlDB;
