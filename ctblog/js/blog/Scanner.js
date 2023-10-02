blog.Scanner = CT.Class({
	CLASSNAME: "blog.Scanner",
	_: {},
	unfimgs: function() {
		var pref = "/img/" + (this.vidMode ? "v" : "z") + "/";
		return (this._.items || this.opts.lister()).map(n => pref + n + ".jpg");
	},
	p2n: function(path) {
		return path.split("/").pop().split(".")[0];
	},
	n2p: function(name) {
		var pref, ext;
		if (this.vidMode) {
			pref = "/v/";
			ext = "mp4";
		} else {
			pref = "/img/z/";
			ext = "jpg";
		}
		return pref + name + "." + ext;
	},
	preview: function(filename) {
		var _ = this._, path;
		if (filename.startsWith("/"))
			filename = this.p2n(filename);
		path = this.n2p(filename);
		if (!_.previewer) {
			var item = CT.dom[this.vidMode ? "video" : "img"]({
				className: "wm400p hm400p",
				controls: true
			});
			_.previewer = CT.modal.modal(item, null, {
				center: false,
				slide: {
					origin: "bottomleft"
				}
			}, true, true);
			_.previewer.item = item;
		}
		_.previewer.item.src = path;
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
		this.vidMode = opts.variety == "video";
		if (!opts.lister) {
			blog.getters[opts.variety + "s"](function(items) {
				_.items = items.map(fname => fname.split(".")[0]);
			}, this.vidMode && "all");
		}
	}
});