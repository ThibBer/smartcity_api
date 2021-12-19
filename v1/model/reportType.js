module.exports.get = get;

module.exports.exist = async (client, id) => {
    return await get(client, id) !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM ReportType ORDER BY id`, []);
}

module.exports.filter = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT * FROM ReportType WHERE id::varchar(11) ~ $1 OR label ~ $1 ORDER BY id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT * FROM ReportType ORDER BY id OFFSET $1 LIMIT $2", [offset, limit]);
}

module.exports.countWithFilter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT COUNT(*) as count FROM ReportType WHERE id::varchar(11) ~ $1 OR label ~ $1", [filter])
    }

    return await client.query("SELECT COUNT(*) as count FROM ReportType", []);
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
    const {rows: reportTypes} = await client.query(`SELECT * FROM ReportType WHERE id = $1`, [id]);

    return reportTypes[0];
}