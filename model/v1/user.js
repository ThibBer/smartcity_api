module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM BackOfficeUser ORDER BY id ASC`, []);
}

module.exports.post = async (client, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    return await client.query(`INSERT INTO BackOfficeUser (id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number) VALUES 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber]);
}

module.exports.patch = async (client, id, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    return await client.query(`UPDATE BackOfficeUser SET email = $1, password = $2, first_name = $3, last_name = $4, birth_date = $5, role = $6, city = $7, street = $8, zip_code = $9, house_number = $10 WHERE id = $11`,
        [email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber, id]);
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}

async function get(client, id) {
    return await client.query(`SELECT * FROM BackOfficeUser WHERE id = $1`, [id]);
}
