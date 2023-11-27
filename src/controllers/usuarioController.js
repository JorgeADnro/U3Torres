const Usuario = require("../models/usuario.js");
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const { notificarFav } = require ('../service/notifi.service.js');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
    const { nombre, direccion, correo , passwd } = req.body;

    const usuario = new Usuario ({nombre,direccion,correo,passwd});

    await usuario.save();

    const token = jwt.sign({_id: usuario._id}, 'secretKey');
    res.status(200).json({token});

}

exports.loguearUsuario = async (req,res) => {

    const { correo , passwd } = req.body;

    const usuario = await Usuario.findOne({correo});

    if(!usuario) return res.status(401).send('El correo no existe');
    if(usuario.passwd !== passwd ) return res.status(401).send('La contraseña es erronea');

    const token = jwt.sign({_id: usuario._id}, 'secretKey');
    return res.status(200).json({token});

}

exports.obtenerUsuario = async (req, res) => {
    try {
        // El ID del usuario se encuentra en req.usuarioId
        const usuario = await Usuario.findById(req.usuarioId._id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Aquí decides qué información del usuario deseas devolver en la respuesta
        const usuarioInfo = {
            nombre: usuario.nombre,
            direccion: usuario.direccion,
            correo: usuario.correo,
            // ... otras propiedades que desees incluir
        };

        res.json(usuarioInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.verificador = function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Petición no autorizada');
    }

    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Petición no autorizada');
    }

    try {
        const payload = jwt.verify(token, 'secretKey');
        req.usuarioId = payload; // Asigna el payload al objeto req.user
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).send('Token no válido');
    }

}

exports.añadirFav = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuarioId._id);
        const libroTitl = req.body.libroTitl;
        const libroId = req.body.libroId;

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (usuario.favoritos.includes(libroId)) {
            return res.status(400).json({ message: 'El libro ya está en favoritos' });
        }

        // Agregar el ID del libro a la lista de favoritos
        usuario.favoritos.push({ libroId: req.body.libroId, libroTitl: req.body.libroTitl });

        await usuario.save();

        notificarFav(usuario.nombre, usuario.correo, libroTitl);

        res.json({ message: 'Libro agregado a favoritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.verFavs = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuarioId._id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json(usuario.favoritos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.eliminarFav = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuarioId._id);
        const libroId = req.body.libroId;

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!usuario.favoritos.includes(libroId)) {
            return res.status(400).json({ message: 'El libro no está en favoritos' });
        }

        // Encuentra el índice del libro en favoritos
        const index = usuario.favoritos.indexOf(libroId);

        // Elimina el elemento del array
        usuario.favoritos.splice(index, 1);

        await usuario.save();

        res.json({ message: 'Libro eliminado de favoritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};