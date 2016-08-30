blog.core.util = {
	_newPost: "<b>New " + core.config.ctblog.post.name + "</b>",
	post: function() { // TODO: fill this out! (steal from pages/post)
		(new CT.dom.Modal({
			content: [
				CT.dom.node("Submit Your " + core.config.post.name),
				// etc....
			]
		})).show()
	},
	comment: function(c) {
		var u = CT.data.get(c.user);
		return CT.dom.node([
			CT.dom.link([
				CT.dom.img(u.img, "h50 vmiddle"),
				CT.dom.pad(),
				CT.dom.node(u.firstName, "b", "h50 round hoverglow")
			], null, "/user/profile.html#" + u.key),
			CT.dom.node(": " + c.body, "span")
		], "div", "margined padded bordered round");
	}
};
blog.core.util._user = user.core.get();