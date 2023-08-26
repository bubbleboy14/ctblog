blog.vcfg.Filer = CT.Class({
	CLASSNAME: "blog.vcfg.Filer",
	_: {},
	xplat: function(d) {
		alert("unimplemented");
	},
	upload: function(d) {
		var reg = this.register, p2n = this.p2n;
		CT.modal.prompt({
			prompt: "please select the video",
			style: "file",
			cb: function(ctfile) {
				ctfile.upload("/_blog", ipath => reg(d, p2n(ipath)), {
					action: "v"
				});
			}
		});
	},
	p2n: function(path) {
		return path.split("/").pop().split(".")[0];
	},
	unfiled: function() {
		return this.vids.map(v => v.split(".")[0]).filter(n => !(n in this.filed));
	},
	unfimgs: function() {
		return this.unfiled().map(n => "/img/v/" + n + ".jpg");
	},
	register: function(d, filename) {
		if (d.filename) // unregister
			delete this.filed[d.filename];
		this.filed[filename] = d;
		this.saver(d, "filename", filename);
	},
	select: function(d) {
		CT.modal.prompt({
			prompt: "please select the video",
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
			cb: ipath => this.register(d, this.p2n(ipath))
		});
	},
	edit: function(d) {
		CT.modal.choice({
			prompt: "how do you want to specify the video file?",
			data: ["select", "upload", "xplat"],
			cb: sel => this[sel](d)
		});
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
	files: function(d) {
		var cont = [
			CT.dom.button("edit", () => this.edit(d), "right"),
			"file"
		];
		if (d.filename) {
			cont.push([
				CT.dom.div([
					CT.dom.link("(play)", () => this.preview(d.filename)),
					CT.dom.pad(),
					CT.dom.span(d.filename, "bold"),
					CT.dom.pad(),
					CT.dom.link("(view)", null, "/blog/vid.html#" + d.key)
				], "centered up30"),
				CT.dom.img("/img/v/" + d.filename + ".jpg", "w1")
			]);
		} else
			cont.push("(no file specified)");
		return CT.dom.div(cont, "bordered padded round mt10");
	},
	file: function() {
		this.filed = {};
		for (var t in this.tagged)
			if (this.tagged[t].filename)
				this.filed[this.tagged[t].filename] = this.tagged[t];
	},
	init: function(opts) {
		this.opts = opts;
		this.vids = opts.vids;
		this.saver = opts.saver;
		this.tagged = opts.tagged;
		this.file();
	}
});