const {
	removeComment,
	retriveCommentbyId,
	updateComment,
} = require('./comments.models');

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

exports.patchComment = (req, res, next) => {
	const commentId = req.params.comment_id;
	const body = req.body;
	updateComment(commentId, body)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch((err) => {
			next(err);
		});
};
