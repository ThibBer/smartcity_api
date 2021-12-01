module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query('SELECT r.*, row_to_json(rt) as report_type FROM report r JOIN reportType rt ON r.report_type = rt.id ORDER BY r.id');
}

module.exports.filter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT r.*, row_to_json(rt) as report_type, row_to_json(b) as reporter FROM report r JOIN reportType rt ON r.report_type = rt.id JOIN backofficeuser b on r.reporter = b.id WHERE r.id::varchar(11) ~ $1 OR r.description ~ $1 OR r.state ~ $1 OR r.city ~ $1 OR r.street ~ $1 OR r.zip_code::varchar(11) ~ $1 OR r.house_number::varchar(11) ~ $1 OR r.reporter::varchar(11) ~ $1 OR r.report_type::varchar(11) ~ $1", [filter])
    }

    return await client.query("SELECT r.*, row_to_json(rt) as report_type, row_to_json(b) as reporter FROM report r JOIN reportType rt ON r.report_type = rt.id JOIN backofficeuser b on b.id = r.reporter ORDER BY id", []);
}

module.exports.filterWithOffsetLimit = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT r.*, row_to_json(rt) as report_type, row_to_json(b) as reporter FROM report r JOIN reportType rt ON r.report_type = rt.id JOIN backofficeuser b on r.reporter = b.id WHERE r.id::varchar(11) ~ $1 OR r.description ~ $1 OR r.state ~ $1 OR r.city ~ $1 OR r.street ~ $1 OR r.zip_code::varchar(11) ~ $1 OR r.house_number::varchar(11) ~ $1 OR r.reporter::varchar(11) ~ $1 OR r.report_type::varchar(11) ~ $1 ORDER BY r.id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT r.*, row_to_json(rt) as report_type, row_to_json(b) as reporter FROM report r JOIN reportType rt ON r.report_type = rt.id JOIN backofficeuser b on b.id = r.reporter ORDER BY id OFFSET $1 LIMIT $2", [offset, limit]);
}

module.exports.countWithFilter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT COUNT(*) as count FROM report WHERE id::varchar(11) ~ $1 OR description ~ $1 OR state ~ $1 OR city ~ $1 OR street ~ $1 OR zip_code::varchar(11) ~ $1 OR house_number::varchar(11) ~ $1 OR reporter::varchar(11) ~ $1 OR report_type::varchar(11) ~ $1", [filter])
    }

    return await client.query("SELECT COUNT(*) as count FROM report", []);
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

module.exports.getWithUserId = async (client, reporterId) => {
    return await client.query('SELECT R.*, row_to_json(rt) as report_type FROM report r JOIN reportType rt ON r.report_type = rt.id WHERE r.reporter = $1 ORDER BY r.id', [reporterId]);
}

module.exports.patchReportsWhenUserDelete = async (client, userId) => {
    return await client.query('UPDATE report SET reporter = null where reporter = $1', [userId]);
}

module.exports.patchReportsWhenTypeDelete = async (client, typeId) => {
    return await client.query('UPDATE report SET report_type = null where report_type = $1', [typeId]);
}