const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

export const registerUser = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { email, username, password, passwordConfirmation } = body;

    const post = {
        userId: uuid.v4(),
        email,
        username,
        password: bcrypt.hashSync(password, 10),
        passwordConfirmation: bcrypt.hashSync(passwordConfirmation, 10)
    };

    return db.put({
        TableName: 'users',
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