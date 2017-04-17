CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		posts.reverse();
		CT.dom.setContent("ctmain", posts.map(blog.core.util.post));
	}, true);
});