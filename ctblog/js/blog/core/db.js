blog.core.db = {
	comments: function(cb, post) {
		CT.db.get("comment", cb, null, null, null, { post: post.key });
	},
	posts: function(cb, live, myposts) {
		var filters = {};
		if (live)
			filters.live = true;
		if (myposts)
			filters.user = blog.core.util._user.key;
		CT.db.get("post", cb, null, null, null, filters);
	}
};
CT.db.setLimit(1000);