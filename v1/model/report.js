async function get(client, id) {
    const {rows: reports} = await client.query(`SELECT R.*, row_to_json(rt) as report_type FROM report r LEFT JOIN reportType rt ON r.report_type = rt.id WHERE r.id = $1 ORDER BY created_at DESC, id`, [id]);

    return reports[0];
}

module.exports.get = get;

module.exports.exist = async (client, id) => {
    const report = await get(client, id);
    return report !== undefined;
}

module.exports.filter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT r.*, row_to_json(rt) as report_type, json_build_object('id', u.id, 'email', u.email, 'first_name', u.first_name, 'last_name', u.last_name, 'birth_date', u.birth_date, 'role', u.role, 'city', u.city, 'street', u.street, 'zip_code', u.zip_code, 'house_number', u.house_number) as reporter FROM report r LEFT JOIN reportType rt ON r.report_type = rt.id LEFT JOIN \"User\" u on r.reporter = u.id WHERE r.id::varchar(11) ~ $1 OR r.description ~ $1 OR r.state ~ $1 OR r.city ~ $1 OR r.street ~ $1 OR r.zip_code::varchar(11) ~ $1 OR r.house_number::varchar(11) ~ $1 OR r.reporter::varchar(11) ~ $1 OR r.report_type::varchar(11) ~ $1 ORDER BY r.created_at DESC, r.id", [filter])
    }

    return await client.query("SELECT r.*, row_to_json(rt) as report_type, json_build_object('id', u.id, 'email', u.email, 'first_name', u.first_name, 'last_name', u.last_name, 'birth_date', u.birth_date, 'role', u.role, 'city', u.city, 'street', u.street, 'zip_code', u.zip_code, 'house_number', u.house_number) as reporter FROM report r LEFT JOIN reportType rt ON r.report_type = rt.id LEFT JOIN \"User\" u on u.id = r.reporter ORDER BY r.created_at DESC, r.id", []);
}

module.exports.filterWithOffsetLimit = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT r.*, row_to_json(rt) as report_type, json_build_object('id', u.id, 'email', u.email, 'first_name', u.first_name, 'last_name', u.last_name, 'birth_date', u.birth_date, 'role', u.role, 'city', u.city, 'street', u.street, 'zip_code', u.zip_code, 'house_number', u.house_number) as reporter FROM report r LEFT JOIN reportType rt ON r.report_type = rt.id LEFT JOIN \"User\" u on r.reporter = u.id WHERE r.id::varchar(11) ~ $1 OR r.description ~ $1 OR r.state ~ $1 OR r.city ~ $1 OR r.street ~ $1 OR r.zip_code::varchar(11) ~ $1 OR r.house_number::varchar(11) ~ $1 OR r.reporter::varchar(11) ~ $1 OR r.report_type::varchar(11) ~ $1 ORDER BY r.created_at DESC, r.id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT r.*, row_to_json(rt) as report_type, json_build_object('id', u.id, 'email', u.email, 'first_name', u.first_name, 'last_name', u.last_name, 'birth_date', u.birth_date, 'role', u.role, 'city', u.city, 'street', u.street, 'zip_code', u.zip_code, 'house_number', u.house_number) as reporter FROM report r LEFT JOIN reportType rt ON r.report_type = rt.id LEFT JOIN \"User\" u on u.id = r.reporter ORDER BY r.created_at DESC, r.id OFFSET $1 LIMIT $2", [offset, limit]);
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
    const params = [id];
    const querySet = [];
    let query = "UPDATE Report SET ";

    if(description !== undefined){
        params.push(description);
        querySet.push(`description = $${params.length} `);
    }

    if(state !== undefined){
        params.push(state);
        querySet.push(`state = $${params.length} `);
    }

    if(city !== undefined){
        params.push(city);
        querySet.push(`city = $${params.length} `);
    }

    if(street !== undefined){
        params.push(street);
        querySet.push(`street = $${params.length} `);
    }

    if(zip_code !== undefined){
        params.push(zip_code);
        querySet.push(`zip_code = $${params.length} `);
    }

    if(house_number !== undefined){
        params.push(house_number);
        querySet.push(`house_number = $${params.length} `);
    }

    if(reporter !== undefined){
        params.push(reporter);
        querySet.push(`reporter = $${params.length} `);
    }

    if(report_type !== undefined){
        params.push(report_type);
        querySet.push(`report_type = $${params.length} `);
    }
    query += querySet.join(', ');

    query += "WHERE id = $1";

    return await client.query(query, params);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM report WHERE id = $1', [id]);
}

module.exports.getWithUserId = async (client, reporterId) => {
    return await client.query("SELECT r.*, row_to_json(rt) as report_type, json_build_object('id', u.id, 'email', u.email, 'first_name', u.first_name, 'last_name', u.last_name, 'birth_date', u.birth_date, 'role', u.role, 'city', u.city, 'street', u.street, 'zip_code', u.zip_code, 'house_number', u.house_number) as reporter FROM report r LEFT JOIN reportType rt ON r.report_type = rt.id LEFT JOIN \"User\" u on u.id = r.reporter WHERE r.reporter = $1 ORDER BY r.created_at DESC", [reporterId]);
}

module.exports.patchReportsWhenUserDelete = async (client, userId) => {
    return await client.query('UPDATE report SET reporter = null where reporter = $1', [userId]);
}

module.exports.patchReportsWhenTypeDelete = async (client, typeId) => {
    return await client.query('UPDATE report SET report_type = null where report_type = $1', [typeId]);
}