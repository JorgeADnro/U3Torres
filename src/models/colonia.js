const mongoose = require("mongoose");

const coloniaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Colonia', coloniaSchema);