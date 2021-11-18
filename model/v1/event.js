module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
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

async function get(client, id) {
    return await client.query(`SELECT * FROM event WHERE id = $1`, [id]);
}