const db = require('../../db/connection');

exports.retriveAuthors = (name) => {
	let queryString = `select * from users `;
	let queryValues = [];

	if (name) {
		queryValues.push(name);
		queryString += 'where username = $1 ';
	}

	return db.query(queryString, queryValues).then(({ rows }) => {
		if (!rows.length) {
			return Promise.reject({
				status: 404,
				msg: 'Not found.',
			});
		}
		return rows;
	});
};
