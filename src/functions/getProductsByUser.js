const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export const getProductsByUser = async (event, context, callback) => {

    const userId = event.pathParameters.id;

    const { Authorization } = event.headers;
    if(!Authorization) return callback(null, response(401, 'missing authorization token'));

    //const token = Authorization.split(' ')[1];


    const params = {
        Key: { userId },
        TableName: 'userBuys'
    };

    return db.get(params).promise()
        .then(res => {
            if(res.Item) callback(null, response(200, res.Item));
            else callback(null, response(404, { error: 'no purchase from this account yet'}));
        })
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