module.exports.get = async (client, id) => {
    return await client.query(`SELECT * FROM event WHERE id = $1`, [id]);
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM event`, []);
}

module.exports.post = async (client) => {
    throw new Error("Not implemented");
}

module.exports.patch = async (client) => {
    throw new Error("Not implemented");
}

module.exports.delete = async (client) => {
    throw new Error("Not implemented");
}