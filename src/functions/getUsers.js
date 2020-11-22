const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export const getUsers = async (event, context, callback) => {
    return db.scan({
        TableName: 'users'
    }).promise().then(res => {
        callback(null, response(200, res.Items));
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