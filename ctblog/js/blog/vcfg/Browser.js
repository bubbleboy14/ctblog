blog.vcfg.Browser = CT.Class({
	CLASSNAME: "blog.vcfg.Browser",
	saver: function(d, prop, val) {
		var edited = this._.edited, eopts = {};
		d[prop] = eopts[prop] = val;
		if (d.key)
			eopts.key = d.key;
		else
			eopts.modelName = d.modelName;
		blog.vcfg.util.vz(function(upd) {
			edited(d, upd);
			Object.assign(d, upd);
		}, {
			vinfo: eopts
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
	view: function(d) {
		CT.dom.setContent(this._.nodes.content, [
			this.namer(d),
			this.blurber(d),
			this.tagger.tags(d),
			this.filer.files(d)
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
			allvids: vz.all
		}, this.opts);
		this._.tagged = {}
		this.tagger = new blog.vcfg.Tagger({
			saver: this.saver
		});
		this.filer = new blog.vcfg.Filer({
			vids: vz.all,
			saver: this.saver,
			tagged: this._.tagged
		});
	}
}, CT.Browser);