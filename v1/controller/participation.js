const pool = require('../model/database');
const Participation = require("../model/participation");
const User = require("../model/user");
const Event = require("../model/event");

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

            if(participation === undefined){
                res.sendStatus(404);
            }else{
                res.status(200).json(participation);
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
 *@swagger
 *components:
 *  responses:
 *      ParticipationAdded:
 *          description: La participation a été ajoutée
 *      InvalidParticipationId:
 *          description: Id de la participation invalide
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
    const participant = parseInt(req.body.participant);
    const event = parseInt(req.body.event);

    try {
        if(isNaN(participant)){
            res.status(400).json({error: "Id du participant invalide"});
        }else if(isNaN(event)){
            res.status(400).json({error: "Id de l'événement invalide"});
        }else{
            const userExist = await User.exist(client, participant);
            const eventExist = await Event.exist(client, event);

            if(!userExist){
                res.status(404).json({error: "Utilisateur inconnu"});
            }else if(!eventExist){
                res.status(404).json({error: "Evénement inconnu"});
            }else{
                await Participation.post(client, participant, event);
                res.sendStatus(201);
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
 *@swagger
 *components:
 *  responses:
 *      ParticipationDeleted:
 *          description: La participation a été supprimée
 *
 */
module.exports.delete = async(req, res) => {
    const client = await pool.connect();
    const participant = parseInt(req.body.participant);
    const event = parseInt(req.body.event);

    try {
        let userExist = !isNaN(participant) && (await User.exist(client, participant));
        let eventExist = !isNaN(event) && (await Event.exist(client, event));

        if(userExist) {
            if(eventExist) {
                await Participation.delete(client, participant, event); // Delete user participation at an event
            } else {
                await Participation.deleteRelatedToUser(client, participant); // Delete all user participation
            }

            res.sendStatus(204);
        } else {
            if(eventExist) {
                await Participation.deleteRelatedToEvent(client, event); // Delete all event participation
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