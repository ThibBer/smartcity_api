module.exports.get = async (client, id) => {
    return await client.query(`SELECT * FROM user WHERE id = $1`, [id]);
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM user`, []);
}

module.exports.post = async (client, id, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber) => {
    return await client.query(`INSERT INTO user (id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number) VALUES 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [id, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber]);
}

module.exports.patch = async (client, id) => {
    throw new Error("Not implemented");
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}
