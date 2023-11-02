/*controllers no son más que las funciones que están definidas en la carpeta 
/* routes, concretamente en el routes/auth.js por eso este controller se llama
/* de la misma manera
*/
//para mantener el tipado javascript
// const express = require('express'); abajo ya desestructurado
const { response } = require('express');
//importamos y dessestructuramos express-validator, que está prevuamente instalado(npm i 'express-validator')
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async( req, res = response ) => {

    const { email, password } = req.body ;
    //siempre poner un return para que solo devuelva una respuesta,
    // en este caso la última condición no hace falta porque solo se ejecutaria esta
    // if (name.length < 5) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'name must contain, at least, 5 characters'
    //     })
    // }

    try {

        // let user = Usuario.findOne({ email: email }) /al ser objeto de javascript,se puede dejar como abajo
        let user = await User.findOne({ email }); // es una promesa
        
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'User already exists'
            });
        }
        
        user = new User( req.body );
        
        //encriptar contraseña
        // const salt = bcrypt.genSaltSync({ rounds: 5 });
        const salt = bcrypt.genSaltSync(); // POR DEFECTO SON 10 ROUNDS
        user.password = bcrypt.hashSync( password, salt );

        await user.save();// es una promesa, por eso tenemos que poner async en la funcion
        
        //generar token JWT, es una promesa('await')
        const token = await generateJWT( user.id, user.name );


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token: token
            // user: req.body
            // name, 
            // email, 
            // password
        })

    } catch (error) {
        
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Please, contact the administrator'
        })
    }
}
const loginUser = async( req, res = response ) => {

    const { email, password } = req.body ;
    //error management
    // const errors = validationResult(req);
    try {

        const user = await User.findOne({ email }); // es una promesa
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'User(email) doesn\'t exist'
            });
        }

        //confirmar password
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect password'
            })
        }

        //generar token JWT, es una promesa('await')
        const token = await generateJWT( user.id, user.name );
        
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token: token

        })

    } catch (error) {
        
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Please, contact the administrator'
        });

    }
   
}

const renewToken = async( req, res = response ) => {

    // const uid = req.uid;
    // const name = req.name;
    //desestructurando
    const { uid, name } = req;

    //generar token JWT, es una promesa('await')
    const token = await generateJWT( uid, name );

    console.log(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}