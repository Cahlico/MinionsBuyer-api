const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

export const buyProducts = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    console.log(body);
    const { products, totalPrice } = body;
    //body = sanitize(body);
    const { email, cep, address } = body;

    const post = {
        userId: uuid.v4(),
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