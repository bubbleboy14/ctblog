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
		if (cfg.post.mode == "post") {
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
			return CT.dom.div([
				unode,
				CT.dom.div(p.title, "biggest bold padded"),
				CT.dom.video(p.video, "w1", null, {
					controls: true,
					poster: p.poster || cfg.post.poster
				}),
				CT.dom.div(p.blurb, "gray italic blockquote"),
				cnode
			], "bordered padded round");
		} else if (cfg.post.mode == "photoset") {
			var pnode = CT.dom.div();
			CT.db.multi(p.photos, function() {
				new CT.slider.Slider({
					parent: pnode,
					navButtons: false,
					frames: p.photos.map(function(item) {
						var photo = CT.data.get(item);
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
	edit: function(p, pnode, tlist) {
		var blurs = core.config.ctblog.post.blurs,
			tmode = core.config.ctblog.post.mode == "post";
		if (p.label == blog.core.util._newPost)
			return CT.db.withSchema(function(schema) {
				blog.core.util.edit(CT.db.edit.getDefaults(core.config.ctblog.post.mode), pnode, tlist);
			});
		var title = CT.dom.smartField({ blurs: blurs.title, value: p.title, classname: "w1" }),
			blurb = CT.dom.smartField({ blurs: blurs.blurb, value: p.blurb, classname: "w1 h100p", isTA: true }),
			body = CT.dom.smartField({ blurs: blurs.body, value: p.body, classname: "w1 h400p", isTA: true }),
			vproc = CT.dom.button("Transcode HLS", function() {
				vproc.innerHTML = "Transcoding...";
				vproc.disabled = true;
				CT.net.post({
					path: "/_vproc",
					spinner: true,
					params: {
						v: p.key
					},
					cb: function() {
						alert("great, you did it!");
						CT.dom.hide(vproc);
					}
				});
			}, "hidden"),
			live = CT.dom.checkboxAndLabel("Go Live", p.live, null, "pointer", "right"),
			cnodes = [title, blog.core.media.item(p)];
		if (core.config.ctblog.post.blurb)
			cnodes.push(blurb);
		if (tmode)
			cnodes.push(body);
		cnodes.push(live);
		if (p.key && core.config.ctblog.media.hls) {
			cnodes.push(vproc);
			CT.net.post({
				path: "/_vproc",
				params: {
					v: p.key,
					check: true
				},
				cb: function(hls) {
					if (!hls)
						CT.dom.show(vproc);
				}
			});
		}
		cnodes.push(CT.dom.button("Submit", function() {
			if (!title.value || (core.config.ctblog.post.blurb && !blurb.value)
				|| (tmode && !body.value))
				return alert("please complete all fields");
			var pdata = {
				user: blog.core.util._user.key,
				title: title.value,
				live: live.firstChild.checked
			};
			if (core.config.ctblog.post.blurb)
				pdata.blurb = blurb.value;
			if (tmode)
				pdata.body = body.value;
			CT.net.post("/_blog", CT.merge({
				action: core.config.ctblog.post.mode,
				key: p.key
			}, pdata), null, function(key) {
				var d = CT.data.get(key);
				if (!d) {
					d = pdata;
					d.key = key;
					d.label = d.title;
					CT.data.add(d);
					var t = CT.panel.trigger(d, function(d) { blog.core.util.edit(d, pnode, tlist); });
					if (tlist.firstChild.nextSibling)
						tlist.insertBefore(t, tlist.firstChild.nextSibling);
					else
						tlist.appendChild(t);
					t.trigger();
				} else {
					for (var pd in pdata)
						p[pd] = pdata[pd];
					if (p.title != p.label)
						p.node.rename(p.title);
				}
			});
		}));
		CT.dom.setContent(pnode, CT.dom.div(cnodes, "bordered padded round"));
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
						CT.dom.setContent("ctmain", blog.core.media.video(d, hls));
					}
				});
			} else if (cfg.post.mode == "photoset")
				blog.core.media.photoset();
		});
	}
};
blog.core.util._user = user.core.get();