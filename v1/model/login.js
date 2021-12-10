const User = require("./user");
const {compareHash} = require("../../utils/jwtUtils");

module.exports.get = async(client, email, password) => {
    const user = await User.getWithEmail(client, email);

    if(user !== undefined && await compareHash(password, user.password)) {
        return user;
    }

    return undefined;
}