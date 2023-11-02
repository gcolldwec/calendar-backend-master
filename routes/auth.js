/**
 *  USER ROUTES/ Auth
 *  host + /api/auth
 */


// const express = require('express');
// const router = express.Router; aqui abajo desestructuro directamente el router

const { Router } = require('express');
//importo el express validator qure he instalado con 'npm i express-validator' y lo desestructuro y saco el 'check'  que es el middleware que se encarga de validar un campo en particular
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { jwtValidator } = require('../middlewares/jwtValidator');


// el middleware es la funcion del parametro del medio, si pongo varias funciones
// las pongo entre llaves, sería una colección de midlewares
router.post(
    '/new',
    [//middlewares
        check('name', 'Name is compulsory').not().isEmpty(),
        check('email', 'Email is compulsory').isEmail(),
        check('password', 'Password is compulsory and must have 6 characters').isLength({ min: 6 }),
        fieldValidators
    ], 
    createUser);

router.post(
    '/', 
    [   //middlewares
        check('email', 'Email is mandatory').isEmail(),
        check('password', 'Password is compulsory and must have 6 characters').isLength({ min: 6}),
        fieldValidators
    ], 
    loginUser);

router.get('/renew', jwtValidator, renewToken);

module.exports = router;