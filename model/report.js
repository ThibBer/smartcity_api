
module.exports.exist = async (client, idReport) => {
    return await client.query(``, [idReport]);
}