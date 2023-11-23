const {
	retriveTopics,
	retriveEndPoints,
	retriveUsers,
} = require('./app.models');
const { removeComment, retriveCommentbyId } = require('./comments.models');

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

exports.deleteComment = (req, res, next) => {
	const commentId = req.params.comment_id;
	retriveCommentbyId(commentId)
		.then(() => {
			return removeComment(commentId);
		})
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
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
