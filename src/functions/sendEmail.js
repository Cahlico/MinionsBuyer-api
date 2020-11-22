const nodemailer = require('nodemailer');

function sendEmail(post) {
    const sender = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: true,
        auth: {
            user: 'carlosaugusto1999@gmail.com',
            pass: 'petropolis'
        }
    });

    const emailFormat = {
        from: 'carlosaugusto1999@gmail.com',
        to: 'carlosaugusto19991@poli.ufrj.br',
        subject: 'Enviando Email com Node.js',
        text: `compra na loja Minions Buyer no valor de ${post.totalPrice}`
    };

    sender.sendMail(emailFormat, (error) => {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = sendEmail;