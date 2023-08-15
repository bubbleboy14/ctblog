blog.vcfg = {
	_: {},
	vz: function(cb, params) {
		CT.net.post({
			path: "/_blog",
			params: CT.merge({
				action: "vz"
			}, params),
			cb: cb
		});
	},
	build: function(videos) { // {all[],tagged[]}
		blog.vcfg._.browser = new blog.vcfg.Browser({
			videos: videos
		});
	},
	init: function() {
		blog.vcfg.vz(blog.vcfg.build);
	}
};

blog.vcfg.Browser = CT.Class({
	view: function(d) {
		// TODO: tags[] ; filename
		CT.dom.setContent(this._.nodes.content, [
			this.namer(d),
			JSON.stringify(d)
		]);
	},
	firstview: function(d) {
		this._.tagged[d.name] = d;
		this.view(d);
	},
	defaults: function() {
		return {
			tags: []
		};
	},
	items: function(items) {
		var i, tz = this._.tagged;
		for (i of items)
			tz[i.name] = i;
	},
	init: function(opts) {
		var vz = opts.videos;
		this.opts = CT.merge(opts, {
			modelName: "vid",
			items: vz.tagged,
			allvids: vz.all,
			owner: false // revisit?
		}, this.opts);
		this._.tagged = {};
	}
}, CT.Browser);