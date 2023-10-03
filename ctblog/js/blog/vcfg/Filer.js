blog.vcfg.Filer = CT.Class({
	CLASSNAME: "blog.vcfg.Filer",
	xplat: function(d) {
		var reg = this.register, p2n = this.scanner.p2n;
		CT.modal.prompt({
			prompt: "what's the url?",
			cb: function(url) {
				CT.net.post({
					path: "/_blog",
					params: {
						action: "v",
						url: url
					},
					cb: vpath => reg(d, p2n(vpath))
				});
			}
		});
	},
	upload: function(d) {
		var reg = this.register, p2n = this.scanner.p2n;
		CT.modal.prompt({
			prompt: "please select the video",
			style: "file",
			cb: function(ctfile) {
				ctfile.upload("/_blog", vpath => reg(d, p2n(vpath)), {
					action: "v"
				});
			}
		});
	},
	register: function(d, filename) {
		if (d.filename) // unregister
			delete this.filed[d.filename];
		this.filed[filename] = d;
		this.saver(d, "filename", filename);
	},
	unfiled: function() {
		return this.vids.map(v => v.split(".")[0]).filter(n => !(n in this.filed));
	},
	select: function(d) {
		this.scanner.select(name => this.register(d, name));
	},
	edit: function(d) {
		CT.modal.choice({
			prompt: "how do you want to specify the video file?",
			data: ["select", "upload", "xplat"],
			cb: sel => this[sel](d)
		});
	},
	files: function(d) {
		var cont = [
			CT.dom.button("edit", () => this.edit(d), "right"),
			"file"
		];
		if (d.filename) {
			cont.push([
				CT.dom.div([
					CT.dom.link("(play)", () => this.scanner.preview(d.filename)),
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
		this.scanner = new blog.Scanner({
			lister: this.unfiled
		});
		this.file();
	}
});