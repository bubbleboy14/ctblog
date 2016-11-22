blog.core.db = {
	comments: function(cb, post) {
		CT.db.get("comment", cb, null, null, null, { post: post.key });
	},
	posts: function(cb, live, myposts) {
		var filters = {},
			mtype = core.config.ctblog.post.mode == "text"
				? "post" : "videopost";
		if (live)
			filters.live = true;
		if (myposts)
			filters.user = blog.core.util._user.key;
		CT.db.get(mtype, cb, null, null, null, filters);
	}
};
CT.db.setLimit(1000);