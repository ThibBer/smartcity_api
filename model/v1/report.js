module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query('SELECT R.*, row_to_json(rt) as report_type FROM report r JOIN reportType rt ON r.report_type = rt.id');
}

module.exports.post = async (client, description, state, city, street, zip_code, house_number, reporter, report_type) => {
    return await client.query('INSERT INTO report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [description, state, city, street, zip_code, house_number, reporter, report_type]);
}

module.exports.patch = async (client, id, description, state, city, street, zip_code, house_number, reporter, report_type) => {
    return await client.query('UPDATE report SET description = $1, state = $2, city = $3, street = $4, zip_code = $5, house_number = $6, reporter = $7, report_type = $8 WHERE id = $9', [description, state, city, street, zip_code, house_number, reporter, report_type, id])
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM report WHERE id = $1', [id]);
}

async function get(client, id) {
    return await client.query(`SELECT R.*, row_to_json(rt) as report_type FROM report r JOIN reportType rt ON r.report_type = rt.id WHERE r.id = $1`, [id]);
}
