blog.core.media = {
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
	photo: function(d, ps, savecb, rmcb, mcb) {
		var caption = CT.dom.field(null, d.caption, "w19-20");
		return CT.dom.div([
			CT.db.edit.media({
				cb: mcb,
				data: d,
				className: "wm400p"
			}),
			caption,
			CT.dom.button("Save", function() {
				if (caption.value == d.caption)
					return savecb && savecb();
				CT.net.post("/_blog", {
					key: d.key,
					action: "photo",
					caption: caption.value,
					user: blog.core.util._user.key
				}, null, function(key) {
					d.caption = caption.value;
					savecb && savecb(key);
				});
			}),
			CT.dom.button("Remove", function() {
				if (!confirm("really remove this picture from the current photoset?"))
					return;
				CT.net.post("/_blog", {
					cb: rmcb,
					key: d.key,
					remove: true,
					action: "photo",
					photoset: ps.key,
					user: blog.core.util._user.key
				});
			})
		]);
	},
	photomodal: function(photo, pset, grid) {
		var m = new CT.modal.Modal({
			transition: "slide",
			content: blog.core.media.photo(photo, pset, function(key) {
				if (key && d.photos.indexOf(key) == -1) {
					d.photos.push(key);
					grid && grid.addCell(blog.core.media.photo2data(key));
				}
				m.hide();
			}, function() {
				CT.dom.remove(photo.key);
				CT.data.remove(pset.photos, photo.key);
				m.hide();
			}, function() {
				setTimeout(m.show, 500);
			})
		});
		m.show();
	},
	photo2data: function(item) {
		var photo = CT.data.get(item);
		return {
			id: photo.key,
			img: photo.img,
			label: photo.caption,
			onclick: function() {
				blog.core.media.photomodal(photo, d);
			}
		};
	},
	photoset: function(d, pnode) {
		CT.db.multi(d.photos, function() {
			var gnode = CT.layout.grid(d.photos.map(blog.core.media.photo2data));
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
								blog.core.media.photomodal(pdata, d, gnode);
							})
						}
					})).show();
				}, "right"),
				gnode
			]);
		});
	},
	item: function(p) {
		if (p.key) {
			var mode = core.config.ctblog.post.mode;
			if (mode == "photoset") {
				var pnode = CT.dom.div();
				blog.core.media.photoset(p, pnode);
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