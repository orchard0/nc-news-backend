const db = require('../../db/connection');
const fs = require('fs/promises');

exports.retriveTopics = () => {
	const sqlQuery = 'select * from topics;';
	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
};

exports.retriveEndPoints = () => {
	return fs
		.readFile(`${__dirname}/../../endpoints.json`, 'utf-8')
		.then((data) => {
			return JSON.parse(data);
		});
};

exports.retriveUsers = () => {
	const queryString = 'select * from users;';
	return db.query(queryString).then(({ rows }) => {
		return rows;
	});
};

exports.retriveTopicbyName = (topic) => {
	const queryString = 'select * from topics where slug = $1';
	return db.query(queryString, [topic]).then(({ rows }) => {
		if (!rows.length) {
			return Promise.reject({
				status: 404,
				msg: 'Not found.',
			});
		}
		return rows;
	});
};
