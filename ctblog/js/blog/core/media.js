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
	photo: function(d, ps, addcb, rmcb) {
		var caption = CT.dom.field(null, d.caption, "w19-20");
		return CT.dom.div([
			CT.db.edit.media({
				data: d,
				className: "wm400p"
			}),
			caption,
			CT.dom.button("Save", function() {
				if (caption.value == d.caption)
					return;
				CT.net.post("/_blog", {
					key: d.key,
					action: "photo",
					caption: caption.value,
					user: blog.core.util._user.key
				}, null, function(key) {
					var isnew = !d.key;
					d.key = key;
					d.caption = caption.value;
					isnew && addcb(key);
				});
			}),
			CT.dom.button("Remove", function() {
				if (!confirm("really remove this picture from the current photoset?"))
					return;
				CT.net.post("/_blog", {
					key: d.key,
					remove: true,
					action: "photo",
					photoset: ps.key,
					user: blog.core.util._user.key,
					cb: rmcb
				});
			})
		]);
	},
	photomodal: function(photo, pset, addcb) {
		var m = new CT.modal.Modal({
			transition: "slide",
			content: blog.core.media.photo(photo, pset, addcb, function() {
				CT.dom.remove(photo.key);
				CT.data.remove(pset.photos, photo.key);
				m.hide();
			})
		});
		m.show();
	},
	photoset: function(d, pnode) {
		var key2data = function(item) {
			var photo = CT.data.get(item);
			return {
				id: photo.key,
				img: photo.img,
				label: photo.caption,
				onclick: function() {
					blog.core.media.photomodal(photo, d);
				}
			};
		};
		CT.db.multi(d.photos, function() {
			var gnode = CT.layout.grid(d.photos.map(key2data));
			CT.dom.setContent(pnode || "ctmain", [
				CT.dom.button("Add Photo", function() {
					blog.core.media.photomodal({}, d, gnode.addCell);
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