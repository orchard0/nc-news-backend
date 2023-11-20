const { retriveTopics } = require('./app.models');

exports.apiReady = (req, res) => {
	res.status(200).send({ msg: 'Ready!' });
};

exports.getTopics = (req, res, next) => {
	console.log('getTopics');
	retriveTopics().then((data) => {
		res.status(200).send(data);
	});
};
