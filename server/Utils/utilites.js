const crypto = require("crypto");

function generateRandomImgNames(bytes=32) {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports =  {generateRandomImgNames}