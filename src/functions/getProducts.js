const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export const getProducts = async (event, context, callback) => {
    return db.scan({
        TableName: 'minions_shop'
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