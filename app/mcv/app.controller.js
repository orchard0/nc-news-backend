const {
	retriveTopics,
	retriveEndPoints,
	retriveUsers,
} = require('./app.models');

exports.getApiEndpoints = (req, res) => {
	retriveEndPoints()
		.then((endPoints) => {
			res.status(200).send({ endPoints });
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getTopics = (req, res, next) => {
	retriveTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};

exports.getUsers = (req, res, next) => {
	retriveUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};
