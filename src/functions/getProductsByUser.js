const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export const getProductsByUser = async (event, context, callback) => {

    const userId = event.pathParameters.id;

    const { Authorization } = event.headers;
    if(!Authorization) return callback(null, response(401, { message: 'missing authorization token' }));

    const token = Authorization.split(' ')[1];

    db.get({
        Key: { userId },
        TableName: 'session'
    }).promise().then(res => {
        if(res.Item.token !== token) return callback(null, response(401, { message: 'invalid token' }));
    }).catch(err => callback(null, response(err.statusCode, err)));

    const params = {
        Key: { userId },
        TableName: 'userBuys'
    };

    return db.get(params).promise()
        .then(res => {
            if(res.Item) callback(null, response(200, res.Item));
            else callback(null, response(404, { error: 'no purchases from this account yet'}));
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

/*async function isAvailable() {

}*/