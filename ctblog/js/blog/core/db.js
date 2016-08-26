blog.core.db = {
	comments: function(cb, post) {
		CT.db.get("comment", cb, null, null, null, {
			post: {
				value: post.key,
				comparator: "=="
			}
		});
	},
	posts: function(cb, myposts) {
		CT.db.get("post", cb, null, null, null, blog.core.util._user && {
			user: {
				value: blog.core.util._user.key,
				comparator: "=="
			}
		});
	}
};
CT.db.setLimit(1000);