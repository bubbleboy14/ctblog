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
	saver: function(d, prop, val) {
		var edited = this._.edited;
		d[prop] = val;
		blog.vcfg.vz(function(upd) {
			edited(d, upd);
			Object.assign(d, upd);
		}, {
			vinfo: d
		});
	},
	blurber: function(d) {
		return CT.dom.smartField({
			isTA: true,
			value: d.blurb,
			classname: "w1 h200p",
			blurs: ["describe the video", "what's it about?", "tell me about it"],
			cb: val => this.saver(d, "blurb", val)
		});
	},
	tagger: function(d) { // tags[]

	},
	filer: function(d) { // filename

	},
	view: function(d) {
		CT.dom.setContent(this._.nodes.content, [
			this.namer(d),
			this.blurber(d),
			this.tagger(d),
			this.filer(d)
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