const User = require("./user");
const {compareHash} = require("../../utils/jwtUtils");

module.exports.get = async(client, email, password) => {
    const {rows: users} = await User.getWithEmail(client, email);

    const user = users[0];
    if(user !== undefined && await compareHash(password, user.password)) {
        return user;
    }

    return undefined;
}