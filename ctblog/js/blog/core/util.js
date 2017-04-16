blog.core.util = {
	_newPost: "<b>New " + core.config.ctblog.post.name + "</b>",
	post: function(p) {
		var cnode = CT.dom.node(), unode = CT.dom.node(null, "div", "right"),
			cfg = core.config.ctblog;
		blog.core.db.comments(function(comments) {
			var required = comments.map(function(c) {
				return c.user;
			});
			required.push(p.user);
			CT.db.multi(required, function() {
				var poster = CT.data.get(p.user);
				CT.dom.setContent(unode, CT.dom.link([
					CT.dom.img(poster.img, "w100 block"),
					CT.dom.node(poster.firstName + " " + poster.lastName, "div", "small centered")
				], null, "/user/profile.html#" + p.key, "round block hoverglow"));
				var content = [
					CT.dom.node("Comments", "div", "bigger bold"),
					comments.map(blog.core.util.comment)
				];
				if (blog.core.util._user)
					content.push([
						CT.dom.smartField({
							classname: "w1",
							blurs: cfg.blog.blurs.comment,
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
		if (cf.post.mode == "post") {
			return CT.dom.div([
				unode,
				CT.dom.node(p.title, "div", "biggest bold padded"),
				CT.dom.img(p.img, "w1"),
				CT.dom.node(p.blurb, "div", "gray italic blockquote"),
				CT.dom.node(p.body.split("\n").map(function(sec) {
					return sec || CT.dom.br();
				}), "div", "padded"),
				cnode
			], "bordered padded round");
		} else if (cfg.post.mode == "videopost") {
			return CT.dom.node([
				unode,
				CT.dom.node(p.title, "div", "biggest bold padded"),
				CT.dom.video(p.video, "w1", null, {
					controls: true,
					poster: p.poster || cfg.post.poster
				}),
				CT.dom.node(p.blurb, "div", "gray italic blockquote"),
				cnode
			], "bordered padded round");
		} else if (cfg.post.mode == "photoset") {
			var pnode = CT.dom.div();
			CT.db.multi(p.photos, function() {
				new CT.slider.Slider({
					parent: pnode,
					navButtons: false,
					frames: p.photos.map(function(item) {
						var photo = CT.data.get(itme);
						return {
							title: photo.caption,
							img: photo.img
						};
					})
				});
			});
			return pnode;
		}
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
	},
	video: function(d, hls) {
		var opts = {
			controls: true,
			poster: d[0].poster || core.config.ctblog.post.poster
		};
		if (!CT.info.androidTablet)
			opts.autoplay = true;
		return CT.dom.video(((CT.info.iOs || CT.info.androidTablet) && hls)
			? d[0].video.replace("/blob/", "/blob/hls/") + "/list.m3u8"
			: d[0].video, "full", null, opts);
	},
	latest: function() {
		var cfg = core.config.ctblog;
		blog.core.db.latest(function(d) {
			if (cfg.post.mode == "post")
				CT.dom.setContent("ctmain", blog.core.util.post(d));
			else if (cfg.post.mode == "videopost") {
				CT.net.post({
					path: "/_vproc",
					params: {
						v: d[0].key,
						check: true
					},
					cb: function(hls) {
						CT.dom.setContent("ctmain", blog.core.util.video(d, hls));
					}
				});
			} else if (cfg.post.mode == "photoset") {
				CT.db.multi(d.photos, function() {
					CT.dom.setContent("ctmain", CT.layout.grid(d.photos.map(function(item) {
						var photo = CT.data.get(item);
						return {
							label: photo.caption,
							img: photo.img
						};
					})));
				});
			}
		});
	}
};
blog.core.util._user = user.core.get();