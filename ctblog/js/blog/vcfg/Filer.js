blog.vcfg.Filer = CT.Class({
	CLASSNAME: "blog.vcfg.Filer",
	xplat: function(d) {
		alert("unimplemented");
	},
	upload: function(d) {
		alert("unimplemented");
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
			data: this.unfimgs(),
			cb: ipath => this.register(d, ipath.split("/").pop().split(".")[0])
		});
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
				CT.dom.img("/img/v/" + d.filename + ".jpg", "w1"),
				CT.dom.link(d.filename, function() {
					CT.modal.modal(CT.dom.video("/v/" + d.filename + ".mp4"));
				})
			]);
		} else
			cont.push("(no file specified");
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