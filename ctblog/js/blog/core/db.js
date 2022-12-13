blog.core.db = {
	comments: function(cb, post) {
		CT.db.get("comment", cb, null, null, null, { post: post.key });
	},
	posts: function(cb, live, myposts, variety, filters, order, limit, offset, sync) {
		filters = filters || {};
		if (live)
			filters.live = true;
		if (myposts && blog.core.util._user)
			filters.user = blog.core.util._user.key;
		return CT.db.get(variety || core.config.ctblog.post.mode, cb, limit, offset, order, filters, sync);
	},
	latest: function(cb, variety, filters, limit, offset, sync) {
		return blog.core.db.posts(cb, true, false, variety,
			filters, "-created", limit || 1, offset, sync);
	}
};
CT.db.setLimit(1000);