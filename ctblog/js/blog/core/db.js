blog.core.db = {
	comments: function(cb, post) {
		CT.db.get("comment", cb, null, null, null, {
			post: {
				value: post.key,
				comparator: "=="
			}
		});
	},
	posts: function(cb, live, myposts) {
		var filters = {};
		if (live) {
			filters.live = {
				value: true,
				comparator: "=="
			}
		}
		if (myposts) {
			filters.user = {
				value: blog.core.util._user.key,
				comparator: "=="
			};
		}
		CT.db.get("post", cb, null, null, null, filters);
	}
};
CT.db.setLimit(1000);