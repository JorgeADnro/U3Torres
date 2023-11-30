const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'phpmailertest633@gmail.com',
        pass: 'difr gafm uwik vlle'
    }
});

// Función que envía el correo
notificarFav = (nombre, correo, libroTitl) => {
    const mailOptions = {
        from: 'phpmailertest633@gmail.com',
        to: correo,
        subject: `Hola ${nombre}!`,
        text: `Te informamos que has agregado el libro "${libroTitl}" a tus favoritos. ¡Gracias por utilizar nuestro servicio!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

libroDisp = (usuariosSus, libroTitl) => {
    // Iterar sobre la lista de usuarios suscritos y enviar un correo a cada uno
    usuariosSus.forEach(usuario => {
        const { usuarioId, usuarioCorreo } = usuario;

        const mailOptions = {
            from: 'phpmailertest633@gmail.com',
            to: usuarioCorreo,
            subject: `Hola!`,
            text: `Solo para informarte que el libro "${libroTitl}" que está en tus favoritos ¡Ahora está disponible!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Correo enviado a ${usuarioCorreo}: ` + info.response);
            }
        });
    });
};

libroPrest = (usuariosSus, libroTitl) => {
    // Iterar sobre la lista de usuarios suscritos y enviar un correo a cada uno
    usuariosSus.forEach(usuario => {
        const { usuarioId, usuarioCorreo } = usuario;

        const mailOptions = {
            from: 'phpmailertest633@gmail.com',
            to: usuarioCorreo,
            subject: `Hola!`,
            text: `Solo para informarte que el libro "${libroTitl}" que está en tus favoritos ¡Ya no está disponible!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Correo enviado a ${usuarioCorreo}: ` + info.response);
            }
        });
    });
};

module.exports = {
    notificarFav,
    libroDisp,
    libroPrest
  };