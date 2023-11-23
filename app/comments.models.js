const db = require('../db/connection');

exports.retriveCommentbyId = (commentId) => {
	const queryString = `select * from comments where comment_id = $1`;
	return db.query(queryString, [commentId]).then(({ rows }) => {
		if (!rows.length) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};

exports.removeComment = (commentId) => {
	const queryString = `delete from comments where comment_id = $1`;
	return db.query(queryString, [commentId]);
};
