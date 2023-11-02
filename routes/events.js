/**
 *  Event Routes
 *  
 *  /api/events
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

//todas tienen que estar validadas por el JWT, 
//lo hago utilizando use que pasa por todo las dependencias del router
router.use( jwtValidator );

//obtener eventos

router.get(
    '/',
    [], 
    getEvent);

//crear evento
router.post(
    '/', 
    [
        check('title', 'Title is compulsory').not().isEmpty(),
        check('start', 'Initial date is compulsory').custom( isDate ),
        check('end', 'Final date is compulsory').custom( isDate ),
        
        fieldValidators

    ],
    createEvent);


//actualizar evento
router.put(
    '/:id', 
    [
        fieldValidators
    ], 
    updateEvent
);

//eliminar evento
router.delete(
    '/:id', 
    fieldValidators, 
    deleteEvent
);

module.exports = router;
