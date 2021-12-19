module.exports.get = async (client, userId, eventId) => {
    const {rows: participations} = await client.query('SELECT * FROM participation where participant = $1 AND event = $2', [userId, eventId]);
    return participations[0];
}

module.exports.post = async (client, userId, eventId) => {
    return await client.query('INSERT INTO participation (participant, event) VALUES ($1, $2)', [userId, eventId]);
}

module.exports.delete = async (client, userId, eventId) => {
    return await client.query('DELETE FROM participation WHERE participant = $1 AND event = $2', [userId, eventId]);
}

module.exports.deleteRelatedToUser = async(client, userId) => {
    return await client.query('DELETE FROM participation WHERE participant = $1', [userId]);
}

module.exports.deleteRelatedToEvent = async (client, eventId) => {
    return await client.query('DELETE FROM participation WHERE event = $1', [eventId]);
}