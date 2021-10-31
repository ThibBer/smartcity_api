module.exports.get = async (client, id) => {
    return await client.query(`SELECT * FROM ReportType WHERE id = $1`, [id]);
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM ReportType`, []);
}

module.exports.post = async (client, name, label) => {
    return await client.query(`INSERT INTO ReportType (name, label) VALUES ($1, $2)`,
        [name, label]);
}

module.exports.patch = async (client, id, label) => {
    return await client.query(`UPDATE ReportType SET label = $2 WHERE id = $3`,
        [label, id]);
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}