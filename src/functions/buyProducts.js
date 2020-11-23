const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export const buyProducts = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { products, totalPrice } = body;
    const { userId, email, cep, address } = body;
    const { Authorization } = event.headers;
    if(!Authorization) return callback(null, response(401, 'missing authorization token'));

    //const token = Authorization.split(' ')[1];

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