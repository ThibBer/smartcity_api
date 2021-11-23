const {getWithEmail} = require("./user");
const {compareHash} = require("../../utils/jwtUtils");

module.exports.get = async(client, email, password) => {
    const promises = [];
    const promiseUser = getWithEmail(client, email);
    promises.push(promiseUser);
    const values = await Promise.all(promises);

    const userRow = values[0].rows[0];
    if(userRow !== undefined && await compareHash(password, userRow.password)) {
        return userRow;
    } else {
        return null;
    }
}