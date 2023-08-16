blog.vcfg.Filer = CT.Class({
	CLASSNAME: "blog.vcfg.Filer",
	xplat: function(d) {
		alert("unimplemented");
	},
	upload: function(d) {
		alert("unimplemented");
	},
	select: function(d) {
		CT.modal.prompt({
			prompt: "please select the video",
			style: "icon",
			data: this.allvids,
			cb: function(vsel) {

			}
		});
	},
	edit: function(d) {
		CT.modal.choice({
			prompt: "how do you want to specify the video file?",
			data: ["select", "upload", "xplat"],
			cb: sel => this[sel](d)
		});
	},
	file: function(d) {
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
	init: function(opts) {
		this.opts = opts;
		this.saver = opts.saver;
		this.allvids = opts.allvids;
	}
});