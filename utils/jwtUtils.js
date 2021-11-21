const bcrypt = require("bcrypt");
// Cost factor. The higher, the more hashing rounds are done and more difficult to brute-force
const saltRounds = 10;

module.exports.getHash = (string) => bcrypt.hash(string, saltRounds);
module.exports.compareHash = (string, hash) => bcrypt.compare(string, hash);