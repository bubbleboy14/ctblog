blog.core.util = {
	post: function() {
		(new CT.dom.Modal({
			content: [
				CT.dom.node("Submit Your " + core.config.post.name),
				// etc....
			]
		})).show()
	}
};
blog.core.util._user = user.core.get();