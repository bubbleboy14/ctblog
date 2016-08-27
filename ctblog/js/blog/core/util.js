blog.core.util = {
	_newPost: "<b>New " + core.config.ctblog.post.name + "</b>",
	post: function() {
		(new CT.dom.Modal({
			content: [
				CT.dom.node("Submit Your " + core.config.post.name),
				// etc....
			]
		})).show()
	},
	comment: function(c) {
		return CT.dom.node("<b>" + CT.data.get(c.user).firstName + "</b>: " + c.body,
			"div", "margined padded bordered round");
	}
};
blog.core.util._user = user.core.get();