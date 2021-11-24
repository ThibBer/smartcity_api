module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM ReportType ORDER BY id`, []);
}

module.exports.post = async (client, label) => {
    return await client.query(`INSERT INTO ReportType (label) VALUES ($1) RETURNING id`,
        [label]);
}

module.exports.patch = async (client, id, label) => {
    return await client.query(`UPDATE ReportType SET label = $1 WHERE id = $2`,
        [label, id]);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM reporttype WHERE id = $1', [id]);
}

async function get(client, id) {
    return await client.query(`SELECT * FROM ReportType WHERE id = $1`, [id]);
}