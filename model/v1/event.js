module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM event`);
}

module.exports.post = async (client, date_hour, duration, created_at, report, creator) => {
    return await client.query('INSERT INTO event (date_hour, duration, created_at, report, creator) VALUES ($1, $2, $3, $4, $5) RETURNING id', [date_hour, duration, created_at, report, creator]);
}

module.exports.patch = async (client, id, date_hour, duration, created_at, report, creator) => {
    return await client.query('UPDATE event SET date_hour = $1, duration = $2, created_at = $3, report = $4, creator = $5 WHERE id = $6', [date_hour, duration, created_at, report, creator, id]);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM event WHERE id = $1', [id]);
}

async function get(client, id) {
    return await client.query(`SELECT * FROM event WHERE id = $1`, [id]);
}

module.exports.getLinkedToReport = async (client, reportId) => {
    return await client.query('SELECT * FROM event WHERE report = $1', [reportId]);
}