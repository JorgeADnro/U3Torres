const Libro = require("../models/libro.js");
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const mongoose = require("mongoose");
const { enviarCorreoAUsuarios } = require('../service/notifi.service.js');

exports.guardarLibro = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se proporcionaron los archivos');
        }

        const { titulo, editorial, fechpubl, gen, sinop, numpag, estatus } = req.body;

        const foto = req.files['foto'][0];

        const libro = new Libro({
            titulo,
            editorial,
            fechpubl,
            gen,
            sinop,
            numpag,
            foto: {
                data: foto.buffer,
                contentType: foto.mimetype
            },
            estatus
        });

        await libro.save();

        res.send(libro);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerLibros = async (req, res) => {
    try {
        const libro = await Libro.find();
        const libroConBase64 = libro.map(libro => {
            const fotoBase64 = libro.foto.data.toString('base64');
            return {
                ...libro.toObject(),
                foto: fotoBase64,
            };
        });
        res.json(libroConBase64);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

exports.añadirUsr = async (req, res) => {
    try {
        const libroId = req.params.libroId;
        const libro = await Libro.findById(libroId);

        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        const usuarioId = req.query.usuarioId;
        const usuarioCorreo = req.query.usuarioCorreo;

        const usuarioObjectId = mongoose.Types.ObjectId(usuarioId);

        // Verificar si el usuarioId ya está en suscritos
        const existeEnSuscritos = libro.usuarioSus.some(suscrito => suscrito.usuarioId.equals(usuarioObjectId));

        if (existeEnSuscritos) {
            return res.status(400).json({ message: 'El usuario ya está suscrito' });
        }

        // Agregar el nuevo usuario a la lista de suscritos
        libro.usuarioSus.push({ usuarioId: usuarioObjectId, usuarioCorreo });

        await libro.save();

        res.json({ message: 'Usuario suscrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.eliminarUsr = async (req, res) => {
    try {
        const libroId = req.params.libroId;
        const libro = await Libro.findById(libroId);

        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        const usuarioId = req.query.usuarioId;

        const usuarioObjectId = mongoose.Types.ObjectId(usuarioId);

        // Verificar si el usuarioId está en suscritos
        const existeEnSuscritos = libro.usuarioSus.some(suscrito => suscrito.usuarioId.equals(usuarioObjectId));

        if (!existeEnSuscritos) {
            return res.status(400).json({ message: 'El usuario no está suscrito' });
        }

        // Filtrar los usuarios suscritos y eliminar al usuario
        libro.usuarioSus = libro.usuarioSus.filter(suscrito => !suscrito.usuarioId.equals(usuarioObjectId));

        await libro.save();

        res.json({ message: 'Usuario eliminado de suscritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.obtenerUsuariosSuscritos = async (req, res) => {
    try {
        const libroId = req.params.libroId;
        const libro = await Libro.findById(libroId);

        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        // Extraer los usuarios suscritos y devolverlos como respuesta
        const usuariosSuscritos = libro.usuarioSus || [];
        res.json(usuariosSuscritos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.notificarCambioDisp = async (req, res) => {
    try {
        const libroId = req.params.libroId;
        const libro = await Libro.findById(libroId);

        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        const usuariosSus = libro.usuarioSus || [];

        // Envia correos electrónicos a los usuarios suscritos
        libroDisp(usuariosSus, libro.titulo);
        libro.estatus = 'Disponible';
        await libro.save();

        res.json({ message: 'Notificación de cambio enviada a usuarios suscritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.notificarCambioPrest = async (req, res) => {
    try {
        const libroId = req.params.libroId;
        const libro = await Libro.findById(libroId);

        if (!libro) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        const usuariosSus = libro.usuarioSus || [];

        // Envia correos electrónicos a los usuarios suscritos
        libroPrest(usuariosSus, libro.titulo);
        libro.estatus = 'Prestado';
        await libro.save();

        res.json({ message: 'Notificación de cambio enviada a usuarios suscritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
