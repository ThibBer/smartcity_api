module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM ReportType`, []);
}

module.exports.post = async (client, label) => {
    return await client.query(`INSERT INTO ReportType (label) VALUES ($1)`,
        [label]);
}

module.exports.patch = async (client, id, label) => {
    return await client.query(`UPDATE ReportType SET label = $2 WHERE id = $3`,
        [label, id]);
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}

async function get(client, id) {
    return await client.query(`SELECT * FROM ReportType WHERE id = $1`, [id]);
}