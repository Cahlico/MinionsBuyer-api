const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
//const nodemailer = require('nodemailer');

export const buyProducts = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { products, totalPrice } = body;
    const { userId, email, cep, address } = body;
    const { Authorization } = event.headers;
    if(!Authorization) return callback(null, response(401, 'missing authorization token'));

    const token = Authorization.split(' ')[1];

    db.get({
        Key: { userId },
        TableName: 'session'
    }).promise().then(res => {
        if(res.Item.token !== token) return callback(null, response(401, { message: 'invalid token' }));
    }).catch(err => callback(null, response(err.statusCode, err)));

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

/*function sendEmail(post) {
    const sender = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: true,
        auth: {
            user: 'carlosaugusto1999@gmail.com',
            pass: ''
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
}*/