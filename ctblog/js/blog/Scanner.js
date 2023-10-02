blog.Scanner = CT.Class({
	CLASSNAME: "blog.Scanner",
	_: {},
	unfimgs: function() {
		return this.opts.lister().map(n => "/img/v/" + n + ".jpg");
	},
	p2n: function(path) {
		return path.split("/").pop().split(".")[0];
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
			cb: ipath => this.opts.cb(d, this.p2n(ipath))
		});
	},
	init: function(opts) {
		this.opts = CT.merge(opts, { // required: cb(), lister()
			variety: "video" // |image
		});
	}
});