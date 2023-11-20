const db = require('../db/connection');

exports.retriveArticleById = (id) => {
	const sqlQuery = `select * from articles where article_id = $1`;
	return db.query(sqlQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};
