const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    calle: {
        type: String,
        required: true
    },
    no: {
        type: String,
        required: true
    },
    col: {
        type: String,
        required: true
    },
    cp: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    passwd: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ['user']
    },
    favoritos: [
        {
            libroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
            libroTitl: String
        }
    ]
});

module.exports = mongoose.model('Usuario', usuarioSchema);