const { response } = require('express');
const brypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario =  async(req, res = response) =>{

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });
        
        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body );
        
        // Escriptar contraseña
        const salt = brypt.genSaltSync();
        usuario.password = brypt.hashSync( password, salt );

        await usuario.save();

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

    
}

const loginUsuario =  async(req, res = response) =>{

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });
        
        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = brypt.compareSync(password, usuario.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );
        
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

    
}

const revalidarToken =  async(req, res = response) =>{

    const { uid, name } = req;

    // Generar nuestro JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}