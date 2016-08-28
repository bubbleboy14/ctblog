CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		CT.dom.setContent("ctmain", posts.map(function(p) {
			var cnode = CT.dom.node();
			blog.core.db.comments(function(comments) {
				CT.db.multi(comments.map(function(c) {
					return c.user;
				}), function() {
					var content = [
						CT.dom.node("Comments", "div", "bigger bold"),
						comments.map(blog.core.util.comment)
					];
					if (blog.core.util._user)
						content.push([
							CT.dom.smartField({
								classname: "w1",
								blurs: core.config.ctblog.blog.blurs.comment,
								cb: function(val) {
									if (val) {
										var pdata = {
											action: "comment",
											user: blog.core.util._user.key,
											post: p.key,
											body: val
										};
										CT.net.post("/_blog", pdata, null, function() {
											cnode.firstChild.firstChild.nextSibling.appendChild(blog.core.util.comment(pdata));
										});
										return "clear";
									}
								}
							})
						]);
					CT.dom.setContent(cnode, content);
				});
			}, p);
			return CT.dom.node([
				CT.dom.node(p.title, "div", "biggest bold padded"),
				CT.dom.img(p.img, "w1"),
				CT.dom.node(p.blurb, "div", "gray italic blockquote"),
				CT.dom.node(p.body, "div", "padded"),
				cnode
			], "div", "bordered padded round");
		}));
	}, true);
});