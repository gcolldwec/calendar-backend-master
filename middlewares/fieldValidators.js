// const express = require('express');
const { response } = require('express');
const { validationResult } = require('express-validator');

const fieldValidators = (req, res = response, next) => {

    //manejo de errores
    const errors = validationResult(req);
    // console.log(errors);
    if ( !errors.isEmpty() ) {
        //si hay errores
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next();
}

module.exports = {
    fieldValidators
}