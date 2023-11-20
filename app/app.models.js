const db = require('../db/connection');

exports.retriveTopics = () => {
	console.log('retriveTopics');
	const sqlQuery = 'select * from topics;';
	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
};
