exports.articleCommentCount = (data) => {
	let count = {};
	for (const entry of data) {
		if (count[entry['article_id']]) {
			count[entry['article_id']] += 1;
		} else {
			count[entry['article_id']] = 0;
		}
	}
	return count;
};
