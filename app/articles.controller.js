const { retriveArticleById } = require('./articles.models');

exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;
	retriveArticleById(id)
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			next(err);
		});
};
