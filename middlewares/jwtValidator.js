const { response } = require('express');
const jwt = require('jsonwebtoken');

const jwtValidator = ( req, res = response, next ) => {

    // x-token in Headers
    const token = req.header('x-token');

    console.log(token);
    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'There\'s no requested token',
        })
    }

    try {
        
        // const payload =  jwt.verify(
        //     token,
        //     process.env.SECRET_JWT_SEED,
        // );

        // console.log(payload);

        // req.uid = payload.uid 
        const { uid, name } =  jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        );

        console.log(uid);

        req.uid = uid;
        req.name = name;

    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });

    }

    next();

}

module.exports = {
    jwtValidator
}