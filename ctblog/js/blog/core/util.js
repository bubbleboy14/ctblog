blog.core.util = {
	_newPost: "<b>New " + core.config.ctblog.post.name + "</b>",
	post: function(p) {
		var cnode = CT.dom.node(), unode = CT.dom.div(null, "right"),
			cfg = core.config.ctblog, mode = p.modelName;
		blog.core.db.comments(function(comments) {
			var required = comments.map(function(c) {
				return c.user;
			});
			required.push(p.user);
			CT.db.multi(required, function() {
				var poster = CT.data.get(p.user);
				CT.dom.setContent(unode, CT.dom.link([
					CT.dom.img(poster.img, "w100 block"),
					CT.dom.div(poster.firstName + " " + poster.lastName, "small centered")
				], null, "/user/profile.html#" + p.key, "round block hoverglow"));
				var content = [
					CT.dom.div("Comments", "bigger bold"),
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
		if (mode == "post") {
			return CT.dom.div([
				unode,
				CT.dom.div(p.title, "biggest bold padded"),
				CT.dom.img(p.img, "w1"),
				CT.dom.div(p.blurb, "gray italic blockquote"),
				CT.dom.div(p.body.split("\n").map(function(sec) {
					return sec || CT.dom.br();
				}), "ctblog_body padded"),
				cnode
			], "bordered padded round");
		} else if (mode == "videopost") {
			return CT.dom.div([
				unode,
				CT.dom.div(p.title, "biggest bold padded"),
				blog.core.media.video.set(p, CT.dom.div()),
				CT.dom.div(p.blurb, "gray italic blockquote"),
				cnode
			], "bordered padded round");
		} else if (mode == "photoset") {
			var shopho = function(photo) {
				CT.modal.modal(CT.dom.img(photo.img, "w1"));
			};
			if (cfg.blog.photoset_embed) {
				var bnode = CT.dom.div(null, "padded"), pnode = CT.dom.div([
					CT.dom.div(p.title, "bigger bold padded centered"),
					bnode
				]), bsplit = p.blurb.split("\n"), ipos = "right", content = [
				], pnum = 0, pushPhoto = function(bottom) {
					var photo = CT.data.get(p.photos[pnum]);
					if (photo) {
						content.push(CT.dom.img({
							imgclass: "padded " + (bottom && "h200p" || ("w1-4 " + ipos)),
							title: photo.caption,
							src: photo.img,
							onclick: () => shopho(photo)
						}));
						ipos = ipos == "right" ? "left" : "right";
						pnum += 1;
					}
				};
				CT.db.multi(p.photos, function() {
					bsplit.forEach(function(par) {
						if (par)
							content.push(CT.dom.div(par, "padded"));
						else
							pushPhoto();
					});
					content.push(CT.dom.div(null, "clearnode"));
					while (p.photos[pnum])
						pushPhoto(true);
					CT.dom.setContent(bnode, content);
				});
				return pnode;
			} else {
				var snode = CT.dom.div(null, "relative noflow w1 h400p"),
					pnode = CT.dom.div([
						CT.dom.div(p.title, "bigger bold padded centered"),
						snode,
						CT.dom.div(p.blurb, "padded")
					]);
				CT.db.multi(p.photos, function() {
					new CT.slider.Slider({
						parent: snode,
						navButtons: false,
						panDuration: cfg.blog.pan_duration,
						frames: p.photos.map(function(item) {
							var photo = CT.data.get(item);
							return {
								onclick: () => shopho(photo),
								title: photo.caption,
								img: photo.img,
								tab: {
									content: CT.dom.div(photo.caption, "big p10"),
									origin: "bottom"
								}
							};
						})
					});
				});
				return pnode;
			}
		}
	},
	edit: function(p, pnode, tlist) {
		var cfg = core.config.ctblog.post,
			blurs = cfg.blurs,
			tmode = p.modelName == "post";
		if (p.label == blog.core.util._newPost)
			return CT.db.withSchema(function(schema) {
				var launchNew = function(variety) {
					blog.core.util.edit(CT.db.edit.getDefaults(variety, null, null, true), pnode, tlist);
				};
				if (cfg.mode == "basepost") {
					CT.modal.choice({
						prompt: "what kind of post is this?",
						data: ["post", "videopost", "photoset"],
						cb: launchNew
					});
				} else
					launchNew(cfg.mode);
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
						action: "hls",
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
		if (cfg.blurb)
			cnodes.push(blurb);
		if (tmode)
			cnodes.push(body);
		else if (p.key && p.modelName == "videopost") {
			cnodes.push([
				CT.dom.div("Select Poster Image Below", "bigger pt10"),
				blog.core.media.item(p, { mediaType: "img", property: "poster" })
			]);
		}
		cnodes.push(live);
		if (p.key && p.video && core.config.ctblog.media.hls) {
			cnodes.push(vproc);
			CT.net.post({
				path: "/_vproc",
				params: {
					v: p.key,
					check: true,
					action: "hls"
				},
				cb: function(hls) {
					if (!hls)
						CT.dom.show(vproc);
				}
			});
		}
		cnodes.push(CT.dom.button("Submit", function() {
			if (!title.value || (cfg.blurb && !blurb.value)
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
			var doSubmit = function() {
				CT.net.post("/_blog", CT.merge({
					action: p.modelName,
					key: p.key
				}, pdata), null, function(key) {
					var d = CT.data.get(key);
					if (!d) {
						d = CT.merge(pdata, p);
						d.key = key;
						d.label = d.title;
						if (p.modelName == "photoset")
							d.photos = [];
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
			};
			if (cfg.tags && cfg.tags.length) {
				(new CT.modal.Prompt({
					className: cfg.taggerClass || "basicpopup mosthigh", // backwards compatibility...
					style: "multiple-choice",
					prompt: "tag your post",
					data: cfg.tags,
					cb: function(choices) {
						pdata.tags = choices;
						doSubmit();
					}
				})).show();
			} else
				doSubmit();
		}));
		p.key && cnodes.push(CT.dom.button("Delete", function() {
			if (!confirm("are you sure?") || !confirm("are you really sure?"))
				return;
			CT.net.post("/_blog", {
				action: "rm",
				key: p.key,
				user: user.core.get("key")
			}, null, function() {
				alert("you did it!");
				location = location; // hacky lol
			});
		}, "red"));
		CT.dom.setContent(pnode, CT.dom.div(cnodes, "bordered padded round"));
	},
	comment: function(c) {
		var u = CT.data.get(c.user);
		return CT.dom.div([
			CT.dom.link([
				CT.dom.img(u.img, "h50 vmiddle"),
				CT.dom.pad(),
				CT.dom.node(u.firstName, "b", "h50 round hoverglow")
			], null, "/user/profile.html#" + u.key),
			CT.dom.span(": " + c.body)
		], "margined padded bordered round");
	},
	latest: function(emptycb, hitcb) {
		var cfg = core.config.ctblog;
		blog.core.db.latest(function(d) {
			if (!d || !d.length)
				emptycb && emptycb();
			else if (hitcb)
				hitcb(d[0]);
			else if (["post", "basepost"].includes(cfg.post.mode))
				CT.dom.setContent("ctmain", blog.core.util.post(d[0]));
			else if (cfg.post.mode == "videopost")
				blog.core.media.video.set(d[0], null, true);
			else if (cfg.post.mode == "photoset")
				blog.core.media.photo.set(d[0]);
		});
	}
};
blog.core.util._user = user.core.get();