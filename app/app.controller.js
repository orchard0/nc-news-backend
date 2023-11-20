const { retriveTopics, retriveEndPoints } = require('./app.models');

exports.getApiEndpoints = (req, res) => {
	retriveEndPoints()
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getTopics = (req, res, next) => {
	retriveTopics().then((data) => {
		res.status(200).send(data);
	});
};
