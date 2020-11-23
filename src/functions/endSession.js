const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export const endSession = async (event, context, callback) => {

    const userId = event.pathParameters.id;
    const params = {
        Key: { userId },
        TableName: 'session'
    };

    return db.delete(params).promise()
    .then(() => callback(null, response(200, { message: 'Session ended successfully' })))
    .catch(err => callback(null, response(err.statusCode, err)));
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