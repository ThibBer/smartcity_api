module.exports.get = get;

module.exports.exist = async (client, id) => {
    const {rows} = await get(client, id);
    return rows[0] !== undefined;
}

module.exports.all = async (client) => {
    return await client.query(`SELECT * FROM event ORDER BY id`);
}

module.exports.filter = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT * FROM Event WHERE id::varchar(11) ~ $1 OR duration::varchar(11) ~ $1 OR description ~ $1 OR report::varchar(11) ~ $1 OR duration::varchar(11) ~ $1 OR creator::varchar(11) ~ $1 ORDER BY id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT * FROM Event ORDER BY id OFFSET $1 LIMIT $2", [offset, limit]);
}

module.exports.countWithFilter = async (client, filter) => {
    if(filter !== undefined){
        return await client.query("SELECT COUNT(*) as count FROM Event WHERE id::varchar(11) ~ $1 OR duration::varchar(11) ~ $1 OR description ~ $1 OR report::varchar(11) ~ $1 OR duration::varchar(11) ~ $1 OR creator::varchar(11) ~ $1", [filter])
    }

    return await client.query("SELECT COUNT(*) as count FROM Event", []);
}

module.exports.post = async (client, date_hour, duration, description, report, creator) => {
    return await client.query('INSERT INTO Event (date_hour, duration, description, report, creator) VALUES ($1, $2, $3, $4, $5) RETURNING id', [date_hour, duration, description, report, creator]);
}

module.exports.patch = async (client, id, date_hour, duration, description, report, creator) => {
    return await client.query('UPDATE Event SET date_hour = $1, duration = $2, description = $3, report = $4, creator = $5 WHERE id = $6', [date_hour, duration, description, report, creator, id]);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM Event WHERE id = $1', [id]);
}

async function get(client, id) {
    return await client.query(`SELECT * FROM Event WHERE id = $1`, [id]);
}

module.exports.deleteLinkedToReport = async (client, reportId) => {
    return await client.query('DELETE FROM Event WHERE report = $1', [reportId]);
}

module.exports.getWithReportId = async (client, reportId) => {
    return await client.query('SELECT * FROM event WHERE report = $1', [reportId]);
}

module.exports.patchEventsWhenUserDelete = async (client, userId) => {
    return await client.query('UPDATE Event SET creator = null where creator = $1', [userId]);
}