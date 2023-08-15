blog.vcfg = {
	build: function(videos) { // {all[],tagged[]}
		new blog.vcfg.Browser({
			videos: videos
		});
	},
	init: function() {
		CT.net.post({
			path: "/_blog",
			params: {
				action: "vz"
			},
			cb: blog.vcfg.build
		});
	}
};

blog.vcfg.Browser = CT.Class({
	view: function(d) {
		// override!
		CT.dom.setContent(_.nodes.content, [
			this.namer(d),
			JSON.stringify(d)
		]);
	},
	firstview: function(d) {
		this.view(d);
	},
	defaults: function() {
		// override
	},
	items: function(items) {
		// override
	},
	init: function(opts) {
		var vz = opts.videos;
		this.opts = CT.merge(opts, {
			modelName: "vid",
			items: vz.tagged,
			allvids: vz.all
		}, this.opts);
	}
}, CT.Browser);