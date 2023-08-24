CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	CT.db.one(decodeURIComponent(document.location.hash.slice(1)),
		p => CT.dom.setMain(blog.core.util.post(p)));
});