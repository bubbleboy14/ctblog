blog.Scanner = CT.Class({
	CLASSNAME: "blog.Scanner",
	_: {},
	unfimgs: function() {
		var oz = this.opts, pref = "/img/";
		if (oz.variety == "video")
			pref += "v/";
		return (this._.items || oz.lister()).map(n => pref + n + ".jpg");
	},
	p2n: function(path) {
		return path.split("/").pop().split(".")[0];
	},
	n2p: function(name) {
		var pref, ext;
		if (this.opts.variety == "video") {
			pref = "/v/";
			ext = "mp4";
		} else {
			pref = "/img/z/";
			ext = "jpg";
		}
		return pref + name + "." + ext;
	},
	preview: function(filename) {
		var _ = this._;
		if (filename.startsWith("/"))
			filename = this.p2n(filename);
		if (!_.previewer) {
			var vid = CT.dom.video({
				className: "wm400p hm400p",
				controls: true
			});
			_.previewer = CT.modal.modal(vid, null, {
				center: false,
				slide: {
					origin: "bottomleft"
				}
			}, true, true);
			_.previewer.video = vid;
		}
		_.previewer.video.src = "/v/" + filename + ".mp4";
		_.previewer.show();
	},
	select: function(cb) {
		CT.modal.prompt({
			prompt: "please select the " + this.opts.variety,
			style: "icon",
			page: 10,
			data: this.unfimgs(),
			iclick: this.preview,
			searchable: "up20 right",
			className: "basicpopup mosthigh galimg wm1-2i wmin200p",
			center: false,
			slide: {
				origin: "bottomright"
			},
			cb: ipath => (cb || this.log)(this.p2n(ipath))
		});
	},
	nav: function() {
		this.select(name => window.open(this.n2p(name), "_blank"));
	},
	init: function(opts) {
		var _ = this._;
		this.opts = opts = CT.merge(opts, {
			variety: "video" // |image
		});
		if (!opts.lister) {
			blog.getters[opts.variety + "s"](function(items) {
				_.items = items.map(fname => fname.split(".")[0]);
			}, opts.variety == "video" && "all");
		}
	}
});