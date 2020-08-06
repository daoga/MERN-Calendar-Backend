const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
var cors = require('cors')

// Muestra todas las variables de entorno
//console.log(process.env);

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Lectura y parseo del body
app.use( express.json() );

// Directorio público
app.use( express.static('public') );


//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


// Escuchar petición
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});