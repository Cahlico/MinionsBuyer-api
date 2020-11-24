const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const nodemailer = require('nodemailer');

export const buyProducts = async (event, context, callback) => {

    const body = JSON.parse(event.body);
    const { products, totalPrice, userId, email, cep, address } = body;
    const { Authorization } = event.headers;
    if(!Authorization) return callback(null, response(401, 'missing authorization token'));

    const token = Authorization.split(' ')[1];

    db.get({
        Key: { userId },
        TableName: 'session'
    }).promise().then(res => {
        if(res.Item.token !== token) return callback(null, response(401, { message: 'invalid token' }));
    }).catch(err => callback(null, response(err.statusCode, err)));

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        secureConnection: false,
        port: 587,
        tls: {
          ciphers:'SSLv3'
        },
        auth: {
            user: 'carlosdesafioBGC@outlook.com',
            pass: 'SenhaDoDesafio'
        }
    });

    const emailFormat = {
        from: 'carlosdesafioBGC@outlook.com',
        to: [email, 'carlosaugusto19991@poli.ufrj.br'],
        subject: 'Confirmação de compra Minions Buyer',
        text: `compra na loja Minions Buyer no valor de ${totalPrice.toFixed(2).replace('.', ',')}`
    };

    transporter.sendMail(emailFormat);

    const post = {
        userId,
        email,
        cep,
        address,
        totalPrice,
        products
    };

    return db.put({
        TableName: 'userBuys',
        Item: post
    }).promise().then(() => {
        callback(null, response(201, post));
    }).catch(err => callback(null, response(err.statusCode, err)));
};

function response(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(message)
    };
}