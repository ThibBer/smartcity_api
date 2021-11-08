module.exports.get = async (client, id) => {
    return await client.query(`SELECT row_to_json(r.*) report, row_to_json(b.*) "user", row_to_json(rt.*) report_type FROM Report r JOIN BackOfficeUser b ON r.reporter = b.id JOIN Event e ON b.id = e.creator JOIN ReportType rt ON r.report_type = rt.id WHERE r.id = $1`, [id]);
}

module.exports.all = async (client) => {
    return await client.query(`SELECT row_to_json(r.*) report, row_to_json(b.*) "user", row_to_json(rt.*) report_type FROM Report r JOIN BackOfficeUser b ON r.reporter = b.id JOIN Event e ON b.id = e.creator JOIN ReportType rt ON r.report_type = rt.id`, []);
}

module.exports.post = async (client) => {
    throw new Error("Not implemented");
}

module.exports.patch = async (client) => {
    throw new Error("Not implemented");
}

module.exports.delete = async (client, id) => {
    throw new Error("Not implemented");
}