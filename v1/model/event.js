module.exports.exist = async (client, id) => {
    const {rows: events} = await client.query(`SELECT * FROM Event WHERE id = $1`, [id]);
    return events[0] !== undefined;
}

module.exports.filter = async (client, filter, offset, limit) => {
    if(filter !== undefined){
        return await client.query("SELECT Event.*, u.* as creator, row_to_json(r) as report FROM Event LEFT JOIN \"User\" u on event.creator = u.id LEFT JOIN report r on r.id = event.report WHERE r.id::varchar(11) ~ $1 OR duration::varchar(11) ~ $1 OR r.description ~ $1 OR report::varchar(11) ~ $1 OR duration::varchar(11) ~ $1 OR creator::varchar(11) ~ $1 ORDER BY r.id OFFSET $2 LIMIT $3", [filter, offset, limit])
    }

    return await client.query("SELECT Event.*, u.* as creator, row_to_json(r) as report FROM Event LEFT JOIN \"User\" u on event.creator = u.id LEFT JOIN report r on r.id = event.report ORDER BY r.id OFFSET $1 LIMIT $2", [offset, limit]);
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
    const params = [id];
    const querySet = [];
    let query = "UPDATE Event SET ";

    if(date_hour !== undefined){
        params.push(date_hour);
        querySet.push(`date_hour = $${params.length} `);
    }

    if(duration !== undefined){
        params.push(duration);
        querySet.push(`duration = $${params.length} `);
    }

    if(description !== undefined){
        params.push(description);
        querySet.push(`description = $${params.length} `);
    }

    if(report !== undefined){
        params.push(report);
        querySet.push(`report = $${params.length} `);
    }

    if(creator !== undefined){
        params.push(creator);
        querySet.push(`creator = $${params.length} `);
    }

    query += querySet.join(', ');

    query += "WHERE id = $1";

    return await client.query(query, params);
}

module.exports.delete = async (client, id) => {
    return await client.query('DELETE FROM Event WHERE id = $1', [id]);
}

module.exports.getWithReportId = async (client, reportId) => {
    return await client.query('SELECT * FROM Event WHERE report = $1', [reportId]);
}

module.exports.patchEventsWhenUserDelete = async (client, userId) => {
    return await client.query('UPDATE Event SET creator = null where creator = $1', [userId]);
}