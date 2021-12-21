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

module.exports.post = async (client, label, image) => {
    return await client.query(`INSERT INTO ReportType (label, image) VALUES ($1, $2) RETURNING id`,
        [label, image]);
}

module.exports.patch = async (client, id, label, image) => {
    const params = [id];
    const querySet = [];
    let query = "UPDATE ReportType SET ";

    if(label !== undefined){
        params.push(label);
        querySet.push(`label = $${params.length} `);
    }

    if(image !== undefined){
        params.push(image);
        querySet.push(`image = $${params.length} `);
    }

    query += querySet.join(', ');

    query += "WHERE id = $1";

    return await client.query(query, params);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM reporttype WHERE id = $1', [id]);
}

async function get(client, id) {
    const {rows: reportTypes} = await client.query(`SELECT * FROM ReportType WHERE id = $1`, [id]);

    return reportTypes[0];
}