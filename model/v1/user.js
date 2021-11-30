module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM BackOfficeUser ORDER BY id`, []);
}

module.exports.filter = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT id, email, first_name, last_name, birth_date, role, city, street, zip_code, house_number FROM BackOfficeUser WHERE id::varchar(11) ~ $1 OR email ~ $1 OR first_name ~ $1 OR last_name ~ $1 OR birth_date::varchar(50) ~ $1 OR role ~ $1 OR city ~ $1 OR street ~ $1 OR zip_code::varchar(11) ~ $1 OR house_number::varchar(11) ~ $1 ORDER BY id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT id, email, first_name, last_name, birth_date, role, city, street, zip_code, house_number FROM BackOfficeUser ORDER BY id OFFSET $1 LIMIT $2", [offset, limit]);
}

module.exports.countWithFilter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT COUNT(*) as count FROM BackOfficeUser WHERE id::varchar(11) ~ $1 OR email ~ $1 OR first_name ~ $1 OR last_name ~ $1 OR birth_date::varchar(50) ~ $1 OR role ~ $1 OR city ~ $1 OR street ~ $1 OR zip_code::varchar(11) ~ $1 OR house_number::varchar(11) ~ $1", [filter])
    }

    return await client.query("SELECT COUNT(*) as count FROM BackOfficeUser", []);
}

module.exports.post = async (client, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    return await client.query(`INSERT INTO BackOfficeUser (email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number) VALUES 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber]);
}

module.exports.patch = async (client, id, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    if(password !== null) {
        return await client.query(`UPDATE BackOfficeUser SET email = $1, password = $2, first_name = $3, last_name = $4, birth_date = $5, role = $6, city = $7, street = $8, zip_code = $9, house_number = $10 WHERE id = $11`,
            [email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber, id]);
    } else {
        return await client.query(`UPDATE BackOfficeUser SET email = $1, first_name = $2, last_name = $3, birth_date = $4, role = $5, city = $6, street = $7, zip_code = $8, house_number = $9 WHERE id = $10`,
            [email, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber, id]);
    }
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM BackOfficeUser WHERE id = $1', [id]);
}

module.exports.getWithEmail = async (client, email) => {
    return await client.query('SELECT * FROM BackOfficeUser WHERE email = $1', [email]);
}

async function get(client, id) {
    return await client.query(`SELECT * FROM BackOfficeUser WHERE id = $1`, [id]);
}
