module.exports.get = async (client, id) => {
    return await client.query(`SELECT * FROM BackOfficeUser WHERE id = $1`, [id]);
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM BackOfficeUser`, []);
}

module.exports.post = async (client, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    return await client.query(`INSERT INTO BackOfficeUser (id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number) VALUES 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber]);
}

module.exports.patch = async (client, id) => {
    throw new Error("Not implemented");
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}
