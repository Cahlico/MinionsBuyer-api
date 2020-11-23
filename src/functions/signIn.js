const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

export const signIn = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    const { email, password, userId } = body;
    const token = uuid.v4();

    const post = {
        userId,
        email,
        password,
        token
    };

    return db.put({
        TableName: 'session',
        Item: post
    }).promise().then(() => {
        callback(null, response(200, { userId, email, token }));
    }).catch(err => callback(null, response(err.statusCode, err)));
};

function response(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(message)
    };
}