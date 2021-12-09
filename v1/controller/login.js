require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require("../model/database");
const login = require("../model/login");

/**
 *@swagger
 *components:
 *  responses:
 *      InvalidEmailOrPassword:
 *          description: L'adresse email et/ou le mot de passe sont manquants ou vides
 *      BadCredentials:
 *          description: L'adresse email et/ou le mot de passe sont incorrect
 *      LoggedIn:
 *          description: L'utilisateur a été ajouté
 *          content:
 *              application/json:
 *                  schema:
 *                      type: string
 *  requestBodies:
 *      UserCredentials:
 *           content:
 *               application/json:
 *                   schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Adresse email
 *                          password:
 *                              type: string
 *                              description: Mot de passe
 */
module.exports.login = async(req, res) => {
    const client = await pool.connect();
    const {email, password} = req.body;

    try {
        if(email === undefined) {
            res.status(400).json({error: "Adresse email invalide"});
        } else if(password === undefined){
            res.status(400).json({error: "Mot de passe invalide"});
        } else {
            const user = await login.get(client, email, password);

            if(user === undefined) {
                res.sendStatus(404);
            } else {
                delete user.password;
                const token = jwt.sign({user: user}, process.env.SECRET_TOKEN, {expiresIn: '1d'});

                res.status(200).json(token);
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}