const express = require("express");
const libroController = require('../controllers/libroController.js');
const usuarioController = require('../controllers/usuarioController.js');
const router = express.Router();
const multer = require('multer')
const jwt = require('jsonwebtoken');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const Usuario = require('../models/usuario');
const { notificarFav } = require('../service/notifi.service.js');
const { actualizarEstatusLibro } = require('../controllers/libroController.js');

// Crear libro
router.post('/lib', usuarioController.verificador, upload.fields([{ name: 'foto' }]), libroController.guardarLibro);

// Mostrar Libros
router.get('/libs', libroController.obtenerLibros);

// Suscribir usuario
router.post('/libros/:libroId/aggUsr', libroController.añadirUsr);

router.get('/libros/:libroId/usuariosSuscritos', libroController.obtenerUsuariosSuscritos);

router.post('/libros/:libroId/notificar-cambioDisp',libroController.notificarCambioDisp);

router.post('/libros/:libroId/notificar-cambioPrest',libroController.notificarCambioPrest);

router.delete('/libros/:libroId/eliminar-usr', libroController.eliminarUsr);

// Registrar usuario
router.post('/signup', usuarioController.registrarUsuario);

// Loguear usuario
router.post('/signin', usuarioController.loguearUsuario);

// Obtener usuario
router.get('/info', usuarioController.verificador, usuarioController.obtenerUsuario);

// Añadir a favoritos
router.post('/favoritos/agregar', usuarioController.verificador, usuarioController.añadirFav);

// Ver favoritos
router.get('/favoritos/verFav', usuarioController.verificador, usuarioController.verFavs);

// Eliminar de favoritos
router.delete('/favoritos/eliminar/:libroId', usuarioController.verificador, usuarioController.eliminarFav);

// Obtener todas las ciudades
router.get('/libs/col',usuarioController.obtenerColonias);

module.exports = router;