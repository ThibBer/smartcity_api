const pool = require('../../model/v1/database');
const User = require("../../model/v1/user");
const Event = require("../../model/v1/event");
const Report = require("../../model/v1/report");
const Participation = require("../../model/v1/participation");
const {getHash} = require("../../utils/jwtUtils");

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: id de l'utilisateur
 *              email:
 *                  type: string
 *                  description: adresse email
 *              password:
 *                  type: string
 *                  description: mot de passe
 *              first_name:
 *                  type: string
 *                  description: prénom
 *              last_name:
 *                  type: string
 *                  description: nom
 *              birth_date:
 *                  type: string
 *                  description: date de naissance
 *              role:
 *                  type: string
 *                  description: role
 *              city:
 *                  type: string
 *                  description: ville
 *              street:
 *                  type: string
 *                  description: rue
 *              zip_code:
 *                  type: string
 *                  description: code postal
 *              house_number:
 *                  type: string
 *                  description: numéro d'habitation
 *
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserFound:
 *           description: renvoie un utilisateur
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/User'
 *      InvalidUserId:
 *          description: Id utilisateur invalide
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 */
module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            const {rows: users} = await User.get(client, id);
            const user = users[0];
            if(user !== undefined){
                res.status(200).json(user);
            }else{
                res.status(404).json({error: "Id utilisateur invalide"});
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      UsersFound:
 *           description: renvoie la liste des utilisateurs
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/User'
 */
module.exports.all = async(req, res) => {
    const client = await pool.connect();

    try {
        const {rows: users} = await User.all(client);

        if(users !== undefined){
            res.status(200).json(users);
        }else{
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.filter = async(req, res) => {
    const filter = req.params.filter;
    const offset = req.params.offset;
    const limit = req.params.limit;

    if(isNaN(offset)){
        res.status(400).json({error: "Offset invalide"});
    } else if(isNaN(limit)){
        res.status(400).json({error: "Limite invalide"});
    }else{
        const client = await pool.connect();

        try {
            await client.query("BEGIN;");

            const {rows: users} = await User.filter(client, filter, offset, limit);
            const {rows} = await User.countWithFilter(client, filter);
            await client.query("COMMIT;");

            const counts = rows[0].count;

            res.status(200).json({countWithoutLimit: counts, data: users});
        } catch (error) {
            await client.query("ROLLBACK;");
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      UserAdded:
 *          description: l'utilisateur a été enregistré
 *  requestBodies:
 *      UserToAdd:
 *           content:
 *               application/json:
 *                   schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: adresse email
 *                          password:
 *                              type: string
 *                              description: mot de passe
 *                          first_name:
 *                              type: string
 *                              description: prénom
 *                          last_name:
 *                              type: string
 *                              description: nom
 *                          birth_date:
 *                              type: string
 *                              description: date de naissance
 *                          role:
 *                              type: string
 *                              description: role
 *                          city:
 *                              type: string
 *                              description: ville
 *                          street:
 *                              type: string
 *                              description: rue
 *                          zip_code:
 *                              type: string
 *                              description: code postal
 *                          house_number:
 *                              type: string
 *                              description: numéro d'habitation
 */
module.exports.post = async(req, res) => {
    const client = await pool.connect();
    const {email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number} = req.body;

    try {
        const {rows} = await User.getWithEmail(client, email);
        const emailExists = rows[0] !== undefined;
        if(!emailExists) {
            const result = await User.post(client, email, await getHash(password), first_name, last_name, birth_date, role, city, street, zip_code, house_number);
            res.status(200).json(result.rows[0]);
            console.log(result.rows[0]);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      UserUpdated:
 *          description: l'utilisateur a été mis à jour
 *  requestBodies:
 *      UserToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/User'
 */
module.exports.patch = async(req, res) => {
    const client = await pool.connect();
    const {id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number} = req.body;

    try {
        const userExist = await User.exist(client, id);

        if(userExist){
            let formatedPassword = null;
            if(password !== undefined && password !== null && password.trim() !== "") {
                formatedPassword = getHash(password);
            }
            await User.patch(client, id, email, formatedPassword, first_name, last_name, birth_date, role, city, street, zip_code, house_number);
            res.sendStatus(204);
        }else{
            res.sendStatus(404);
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      UserDeleted:
 *          description: l'utilisateur a été supprimé
 */
module.exports.delete = async(req, res) => {
    const client = await pool.connect();
    const {id} = req.body;

    try {
        const userExist = await User.exist(client, id);

        if(userExist){
            await client.query("BEGIN;");

            await Event.patchEventsWhenUserDelete(client, id);
            await Report.patchReportsWhenUserDelete(client, id);
            await Participation.deleteRelatedToUser(client, id);
            await User.delete(client, id);

            await client.query("COMMIT;");

            res.sendStatus(204);
        }else{
            res.sendStatus(404);
        }
    } catch (error) {
        await client.query("ROLLBACK;");

        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}