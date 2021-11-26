const pool = require('../../model/v1/database');
const Participation = require("../../model/v1/participation");
const User = require("../../model/v1/user");
const Event = require("../../model/v1/event");

/**
 * @swagger
 * components:
 *  schemas:
 *      Participation:
 *          type: object
 *          properties:
 *              participant:
 *                  type: integer
 *                  description: id du participant
 *              event:
 *                  type: integer
 *                  description: id de l'événement
 *
 */

/**
 * @swagger
 * components:
 *  responses:
 *      ParticipationFound:
 *           description: renvoie une participation
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Participation'
 */

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const participant = parseInt(req.params.participant);
    const event = parseInt(req.params.event);
    try {
        if (isNaN(participant) || isNaN(event)) {
            res.sendStatus(400);
        } else {
            const {rows: participations} = await Participation.get(client, participant, event);
            const participation = participations[0];
            if(participation !== undefined){
                res.status(200).json(participation);
            }else{
                res.sendStatus(404);
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
 *      ParticipationsFound:
 *           description: renvoie la liste des participations
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Participation'
 */
module.exports.all = async(req, res) => {
    const client = await pool.connect();

    try {
        const {rows: participations} = await Participation.all(client);

        res.status(200).json(participations);
    } catch(error) {
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
 *      ParticipationAdded:
 *          description: La participation a été ajoutée
 *      InvalidParticipationId:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 *  requestBodies:
 *      ParticipationToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          participant:
 *                              type: number
 *                              format: int
 *                          event:
 *                              type: number
 *                              format: int
 */
module.exports.post = async(req, res) => {
    const client = await pool.connect();
    const {participant, event} = req.body;

    try {
        const userExist = await User.exist(client, participant);
        const eventExist = await Event.exist(client, event);

        if(!userExist){
            res.status(404).json({error: "Id de l'utilisateur invalide"});
        }else if(!eventExist){
            res.status(404).json({error: "Id de l'événement invalide"});
        }else{
            await Participation.post(client, participant, event);
            res.sendStatus(201);
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
 *      ParticipationDeleted:
 *          description: La participation a été supprimée
 *
 */
module.exports.delete = async(req, res) => {
    const client = await pool.connect();
    const {participant, event} = req.body;

    try {
        let userExist = false;
        let eventExist = false;

        if(participant !== undefined) {
            userExist = await User.exist(client, participant);
        }

        if(event !== undefined) {
            eventExist = await Event.exist(client, event);
        }

        if(userExist) {
            if(eventExist) {
                await Participation.delete(client, participant, event);
                res.sendStatus(204);
            } else {
                await Participation.deleteRelatedToUser(client, participant);
                res.sendStatus(204);
            }
        } else {
            if(eventExist) {
                await Participation.deleteRelatedToEvent(client, event);
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}