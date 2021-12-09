require("dotenv").config();
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      MissingJWT:
 *          description: le JWT n'est pas présent
 *      ErrorJWT:
 *          description: le JWT n'est pas valide
 */
module.exports.identification = async (req, res, next) => {
    const headerAuth = req.get('authorization');

    if(headerAuth !== undefined && headerAuth.includes("Bearer")){
        const [_, jwtToken] =  headerAuth.split(' ');

        try{
            const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
            req.session = decodedJwtToken.user;

            next();
        } catch (e) {
            console.error(e);
            res.status(400).json({error: "Votre session a expirée"});
        }
    } else {
        res.sendStatus(401);
    }
};