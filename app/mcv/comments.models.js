const db = require('../../db/connection');

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

exports.updateComment = (commentId, body) => {
	const queryString =
		'update comments set votes = votes + $1 where comment_id = $2 returning *';
	const queryValues = [body.inc_votes, commentId];
	return db.query(queryString, queryValues).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};
