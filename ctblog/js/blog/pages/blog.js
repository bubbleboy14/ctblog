CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");
if (!blog.core.util._user)
	location = "/";

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		CT.dom.setContent("ctmain", post.map(function(p) {
			return CT.dom.node([
				CT.dom.node(p.title, "div", "biggest bold padded"),
				CT.dom.img(p.img, "w1"),
				CT.dom.node(p.blurb, "div", "gray italic blockquote"),
				CT.dom.node(p.body, "div", "padded")
			], "div", "bordered padded round");
		}));
	});
});