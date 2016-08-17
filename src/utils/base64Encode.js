const base64Encode = (string) => new Buffer(string).toString('base64')
module.exports = base64Encode