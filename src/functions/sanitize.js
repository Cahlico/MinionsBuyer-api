const stripHTML = require('string-strip-html');

function sanitize(body) {
    let { email, cep, address } = body;

    email = stripHTML(email).result;
    cep = stripHTML(cep).result;
    address = stripHTML(address).result;

    return { email, cep, address };
}

module.exports = sanitize;