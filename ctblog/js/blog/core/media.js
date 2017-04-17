blog.core.media = {
	item: function(p) {
		if (p.key) {
			var mode = core.config.ctblog.post.mode;
			if (mode == "photoset") {
				var pnode = CT.dom.div();
				blog.core.media.photo.set(p, pnode);
				return pnode;
			}
			return CT.db.edit.media({
				data: p,
				mediaType: (mode == "post") && "img" || "video",
				className: "wm400p"
			});
		} else
			return CT.dom.div("(upload media next -- first, click submit!)", "small");
	}
};

blog.core.media.video = {
	node: function(d, hls, autoplay) {
		var opts = {
			controls: true,
			poster: d.poster || core.config.ctblog.post.poster
		};
		if (autoplay && !CT.info.androidTablet)
			opts.autoplay = true;
		return CT.dom.video(((CT.info.iOs || CT.info.androidTablet) && hls)
			? d.video.replace("/blob/", "/blob/hls/") + "/list.m3u8"
			: d.video, "full", null, opts);
	},
	set: function(d, pnode, autoplay) {
		CT.net.post({
			path: "/_vproc",
			params: {
				v: d.key,
				check: true
			},
			cb: function(hls) {
				CT.dom.setContent(pnode || "ctmain", blog.core.media.video.node(d, hls, autoplay));
			}
		});
		return pnode;
	}
};

blog.core.media.photo = {
	node: function(d, ps, savecb, rmcb, mcb) {
		var caption = CT.dom.field(null, d.caption, "w19-20"), content = [
			CT.db.edit.media({
				cb: mcb,
				data: d,
				className: "wm400p"
			}),
			caption,
			CT.dom.button("Save", function() {
				if (caption.value == d.caption)
					return savecb && savecb(d.key);
				CT.net.post("/_blog", {
					key: d.key,
					action: "photo",
					caption: caption.value,
					user: blog.core.util._user.key
				}, null, function(key) {
					d.caption = caption.value;
					savecb && savecb(key);
				});
			})
		];
		if (rmcb) {
			content.push(CT.dom.button("Remove", function() {
				if (!confirm("really remove this picture from the current photoset?"))
					return;
				CT.net.post("/_blog", {
					key: d.key,
					remove: true,
					action: "photo",
					photoset: ps.key,
					user: blog.core.util._user.key
				}, null, rmcb);
			}));
		}
		return CT.dom.div(content);
	},
	modal: function(photo, pset, grid) {
		var isnew = pset.photos.indexOf(photo.key) == -1, m = new CT.modal.Modal({
			noClose: true,
			transition: "slide",
			className: "basicpopup hminit",
			content: blog.core.media.photo.node(photo, pset, function(key) {
				if (isnew) {
					pset.photos.push(key);
					grid && grid.addCell(blog.core.media.photo.data(key, pset));
				}
				m.hide();
			}, !isnew && function() {
				CT.dom.remove(photo.key);
				CT.data.remove(pset.photos, photo.key);
				m.hide();
			}, function() {
				setTimeout(m.show, 500);
			})
		});
		m.show();
	},
	data: function(item, pset) {
		var photo = CT.data.get(item);
		return {
			id: photo.key,
			img: photo.img,
			label: photo.caption,
			onclick: function() {
				blog.core.media.photo.modal(photo, pset);
			}
		};
	},
	set: function(d, pnode) {
		CT.db.multi(d.photos, function() {
			var gnode = CT.layout.grid(d.photos.map(function(p) {
				return blog.core.media.photo.data(p, d);
			}));
			CT.dom.setContent(pnode || "ctmain", [
				CT.dom.button("Add Photo", function() {
					(new CT.modal.Prompt({
						transition: "slide",
						prompt: "what's the caption?",
						cb: function(caption) {
							CT.net.post("/_blog", {
								action: "photo",
								photoset: d.key,
								caption: caption,
								user: blog.core.util._user.key
							}, null, function(key) {
								var pdata = {
									key: key,
									caption: caption
								};
								CT.data.add(pdata);
								blog.core.media.photo.modal(pdata, d, gnode);
							});
						}
					})).show();
				}, "right"),
				gnode
			]);
		});
	}
};