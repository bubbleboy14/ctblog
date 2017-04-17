CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	var content = CT.dom.div(null, "ctcontent"),
		tlist = CT.dom.div(null, "ctlist"),
		editPost = function(p) {
			blog.core.util.edit(p, content, tlist);
		};
	blog.core.db.posts(function(posts) {
		CT.data.addSet(posts);
		posts.unshift({
			label: blog.core.util._newPost
		});
		CT.panel.triggerList(posts, editPost, tlist);
		tlist.firstChild.trigger();
		CT.dom.setContent("ctmain", [ tlist, content ]);
	}, false, true);
});