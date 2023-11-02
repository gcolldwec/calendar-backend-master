
const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');


console.log( process.env );
//crear servidor de express
const app = express();

//base de datos
dbConnection();


//cors
app.use(cors())

//directorio público
//este use no es más que un middleware, que es una función k se ejecuta cuando alguien hace una petición a mi servidor
app.use( express.static('public') );


//lectura y parse del body
app.use( express.json() );

//rutas
// TODO: auth // crear, login, renew
app.use( '/api/auth', require('./routes/auth') );
// TODO: CRUD: Events
app.use( '/api/events', require('./routes/events'));




//escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});