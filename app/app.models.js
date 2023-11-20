const db = require('../db/connection');
const fs = require('fs/promises');

exports.retriveTopics = () => {
	const sqlQuery = 'select * from topics;';
	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
};

exports.retriveEndPoints = () => {
	return fs
		.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
		.then((data) => {
			return JSON.parse(data);
		});
};
