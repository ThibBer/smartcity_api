module.exports.get = async (client, id) => {
    return await client.query(`SELECT * FROM Report WHERE id = $1`, [id]);
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM Report`, []);
}

module.exports.post = async (client) => {
    throw new Error("Not implemented");
}

module.exports.patch = async (client) => {
    throw new Error("Not implemented");
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}