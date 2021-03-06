const pool = require('../model/database');
const User = require("../model/user");
const Event = require("../model/event");
const Report = require("../model/report");
const Participation = require("../model/participation");
const {getHash} = require("../../utils/jwtUtils");

/**
 * @swagger
 * components:
 *  schemas:
 *      Utilisateur:
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
 *      UtilisateurSansMotDePasse:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: id de l'utilisateur
 *              email:
 *                  type: string
 *                  description: adresse email
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
 *      InvalidUserId:
 *          description: Id utilisateur invalide
 *      UnknowUser:
 *          description: Utilisateur introuvable
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
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const user = await User.get(client, id);

            if(user !== undefined){
                res.status(200).json(user);
            }else{
                res.status(404).json({error: "Id utilisateur inconnu"});
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      InvalidUserFilterData:
 *          description: Utilisateur introuvable
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 *      ValidUserFilter:
 *          description: Utilisateurs correspondants au filtre, décalage et limite
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          countWithoutLimit:
 *                              type: integer
 *                              description: Nombre de données correspond au filtre sans limite
 *                          data:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Utilisateur'
 *                              description: Utilisateurs correspondants au filter, avec limite et décalage
 */
module.exports.filterWithOffsetLimit = async(req, res) => {
    const filter = req.params.filter;
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);

    if(isNaN(offset)){
        res.status(400).json({error: "Offset invalide"});
    } else if(isNaN(limit)){
        res.status(400).json({error: "Limite invalide"});
    }else{
        const client = await pool.connect();

        try {
            const promises = [];
            const promiseFilterWithOffsetLimit = User.filterWithOffsetLimit(client, filter, offset, limit);
            const promiseCountWithFilter = User.countWithFilter(client, filter);

            promises.push(promiseFilterWithOffsetLimit, promiseCountWithFilter);

            const values = await Promise.all(promises);

            const users = values[0].rows;
            const counts = parseInt(values[1].rows[0].count);

            res.status(200).json({countWithoutLimit: counts, data: users});
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      UsersFilter:
 *          description: Utilisateurs correspondants au filtre
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Utilisateur'
 */
module.exports.filter = async(req, res) => {
    const filter = req.params.filter;
    const client = await pool.connect();

    try {
        const {rows: users} = await User.filter(client, filter);

        res.status(200).json(users);
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
 *      EmailAlreadyExist:
 *          description: L'adresse email existe déjà
 *      MissingUserBodyData:
 *          description: Donnée manquante dans le body
 *      UserAdded:
 *          description: L'utilisateur a été ajouté
 *          content:
 *              application/json:
 *                  schema:
 *                      type: integer
 *                      description: Id auto généré
 *  requestBodies:
 *      UserToAdd:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Utilisateur'
 */
module.exports.post = async(req, res) => {
    const {email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number} = req.body;

    if(email === undefined || password === undefined || password.trim() === "" || first_name === undefined || last_name === undefined || birth_date === undefined || role === undefined || city === undefined  || street === undefined || zip_code === undefined || house_number === undefined){
        res.sendStatus(400);
    }else{
        const client = await pool.connect();

        try {
            const user = await User.getWithEmail(client, email);
            const emailExists = user !== undefined;

            if(emailExists) {
                res.status(400).json({error: "L'adresse email existe déjà"});
            } else {
                const result = await User.post(client, email, await getHash(password), first_name, last_name, birth_date, role, city, street, zip_code, house_number);
                res.status(201).json(result.rows[0]);
            }
        } catch (error) {
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
 *      UserUpdated:
 *          description: l'utilisateur a été mis à jour
 *  requestBodies:
 *      UserToPatch:
 *          content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/UtilisateurSansMotDePasse'
 */
module.exports.patch = async(req, res) => {
    const {id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number} = req.body;

    if (isNaN(id) || (email === undefined && first_name === undefined && last_name === undefined && birth_date === undefined && role === undefined && city === undefined && street === undefined && zip_code === undefined && house_number === undefined)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const user = await User.get(client, id);

            if(user === undefined) {
                res.sendStatus(404);
            }else{
                const userWithEmail = await User.getWithEmail(client, email);
                const emailExists = userWithEmail !== undefined;

                if(email !== undefined && emailExists && user.email !== email){
                    res.status(400).json({error: "L'adresse email existe déjà"});
                }else{
                    let updatedPassword = undefined;
                    if(password !== undefined && password !== null && password.trim() !== "") {
                        updatedPassword = getHash(password);
                    }

                    await User.patch(client, id, email, updatedPassword, first_name, last_name, birth_date, role, city, street, zip_code, house_number);
                    res.sendStatus(204);
                }
            }

        } catch (error) {
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
 *      UserDeleted:
 *          description: L'utilisateur a été supprimé
 */
module.exports.delete = async(req, res) => {
    const id = parseInt(req.body.id);

    if(isNaN(id)){
        res.sendStatus(400);
    }else{
        const client = await pool.connect();

        try {
            const userExist = await User.exist(client, id);

            if(!userExist){
                res.sendStatus(404);
            }else{
                await client.query("BEGIN;");

                await Event.patchEventsWhenUserDelete(client, id);
                await Report.patchReportsWhenUserDelete(client, id);
                await Participation.deleteRelatedToUser(client, id);
                await User.delete(client, id);

                await client.query("COMMIT;");

                res.sendStatus(204);
            }
        } catch (error) {
            await client.query("ROLLBACK;");

            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}