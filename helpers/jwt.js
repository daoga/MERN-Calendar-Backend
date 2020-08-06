const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    return new Promise( (resolve, rejects) => {

        const payload = { uid, name };
        
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {

            if ( err ){
                console.log(err);
                rejects('No se pudo generar el token');
            }

            resolve( token );
        })
    });
}

module.exports = {
    generarJWT
}