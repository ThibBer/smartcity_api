require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

module.exports.identification = async (req, res, next) => {
/*    const headerAuth = req.get('authorization');

    if(headerAuth !== undefined && headerAuth.includes("Bearer")){
        const jwtToken =  headerAuth.split(' ')[1];
        console.log(jwtToken)

        try{
            const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
            req.session = decodedJwtToken;
            req.session.authLevel = decodedJwtToken.role;

            next();
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(401);
    }*/

    next();
};