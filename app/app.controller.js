const { retriveTopics } = require('./app.models');

exports.getTopics = (req, res, next) => {
	retriveTopics().then((data) => {
		res.status(200).send(data);
	});
};
