async function get(client, id) {
    const {rows: users} = await client.query(`SELECT * FROM \"User\" WHERE id = $1`, [id]);

    return users[0];
}

module.exports.get = get;

module.exports.getWithEmail = async (client, email) => {
    const {rows: users} = await client.query('SELECT * FROM \"User\" WHERE email = $1', [email])
    return users[0];
}

module.exports.exist = async (client, id) => {
    return await get(client, id) !== undefined;
}

module.exports.filter = async (client, filter) => {
    return await client.query("SELECT id, email, first_name, last_name, birth_date, role, city, street, zip_code, house_number FROM \"User\" WHERE id::varchar(11) ~ $1 OR email ~ $1 OR first_name ~ $1 OR last_name ~ $1 OR birth_date::varchar(50) ~ $1 OR role ~ $1 OR city ~ $1 OR street ~ $1 OR zip_code::varchar(11) ~ $1 OR house_number::varchar(11) ~ $1 ORDER BY id", [filter]);
}

module.exports.filterWithOffsetLimit = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT id, email, first_name, last_name, birth_date, role, city, street, zip_code, house_number FROM \"User\" WHERE id::varchar(11) ~ $1 OR email ~ $1 OR first_name ~ $1 OR last_name ~ $1 OR birth_date::varchar(50) ~ $1 OR role ~ $1 OR city ~ $1 OR street ~ $1 OR zip_code::varchar(11) ~ $1 OR house_number::varchar(11) ~ $1 ORDER BY id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT id, email, first_name, last_name, birth_date, role, city, street, zip_code, house_number FROM \"User\" ORDER BY id OFFSET $1 LIMIT $2", [offset, limit]);
}

module.exports.countWithFilter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT COUNT(*) as count FROM \"User\" WHERE id::varchar(11) ~ $1 OR email ~ $1 OR first_name ~ $1 OR last_name ~ $1 OR birth_date::varchar(50) ~ $1 OR role ~ $1 OR city ~ $1 OR street ~ $1 OR zip_code::varchar(11) ~ $1 OR house_number::varchar(11) ~ $1", [filter])
    }

    return await client.query("SELECT COUNT(*) as count FROM \"User\"", []);
}

module.exports.post = async (client, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    return await client.query(`INSERT INTO User (email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number) VALUES 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber]);
}

module.exports.patch = async (client, id, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    const params = [id];
    const querySet = [];
    let query = "UPDATE User SET ";

    if(email !== undefined){
        params.push(email);
        querySet.push(`email = $${params.length}`);
    }

    if(password !== undefined){
        params.push(password);
        querySet.push(`password = $${params.length}`);
    }

    if(firstName !== undefined){
        params.push(firstName);
        querySet.push(`first_name = $${params.length}`);
    }

    if(lastName !== undefined){
        params.push(lastName);
        querySet.push(`last_name = $${params.length}`);
    }

    if(birthDate !== undefined){
        params.push(birthDate);
        querySet.push(`birth_date = $${params.length}`);
    }

    if(role !== undefined){
        params.push(role);
        querySet.push(`role = $${params.length}`);
    }

    if(city !== undefined){
        params.push(city);
        querySet.push(`city = $${params.length}`);
    }

    if(street !== undefined){
        params.push(street);
        querySet.push(`street = $${params.length}`);
    }

    if(zipCode !== undefined){
        params.push(zipCode);
        querySet.push(`zip_code = $${params.length}`);
    }

    if(houseNumber !== undefined){
        params.push(houseNumber);
        querySet.push(`house_number = $${params.length}`);
    }

    query += querySet.join(', ');

    query += " WHERE id = $1";

    return await client.query(query, params);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM \"User\" WHERE id = $1', [id]);
}