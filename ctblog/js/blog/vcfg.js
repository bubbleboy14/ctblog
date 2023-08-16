blog.vcfg = {
	_: {
		tag: function(cb) {
			var bv = blog.vcfg, _ = bv._;
			CT.modal.prompt({
				prompt: "ok, what's the tag?",
				cb: function(tname) {
					bv.vz(function(tdata) {
						CT.data.add(tdata);
						_.tags.push(tdata);
						cb();
					}, {
						action: "tz",
						name: tname
					}, cb);
				}
			})
		}
	},
	vz: function(cb, params, eb) {
		CT.net.post({
			path: "/_blog",
			params: CT.merge(params, {
				action: "vz"
			}),
			cb: cb,
			eb: eb
		});
	},
	tag: function(d, cb) {
		var bv = blog.vcfg, _ = bv._;
		CT.modal.choice({
			prompt: "please select your tags",
			style: "multiple-choice",
			data: ["new tag"].concat(_.tags),
			selections: d.tags.map(t => CT.data.get(t).name),
			cb: function(tags) {
				if (tags[0] == "new tag")
					return _.tag(() => bv.tag(d, cb));
				cb(tags.map(t => t.key));
			}
		});
	},
	build: function(videos) { // {all[],tagged[]}
		blog.vcfg._.browser = new blog.vcfg.Browser({
			videos: videos
		});
	},
	init: function() {
		var bv = blog.vcfg, _ = bv._;
		CT.db.get("tag", function(tags) {
			_.tags = tags;
			bv.vz(bv.build);
		});
	}
};

blog.vcfg.Tagger = CT.Class({
	CLASSNAME: "blog.vcfg.Tagger",
	edit: function(d) {
		blog.vcfg.tag(d, tags => this.saver(d, "tags", tags));
	},
	node: function(tkey) {
		return CT.dom.div(CT.data.get(tkey).name,
			"bordered padded margined round inline-block");
	},
	tags: function(d) { // tags[]
		return CT.dom.div([
			CT.dom.button("edit", () => this.edit(d), "right"),
			"tags",
			d.tags.map(this.node)
		], "bordered padded round mt10")
	},
	init: function(opts) {
		this.opts = opts;
		this.saver = opts.saver;
	}
});

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

blog.vcfg.Browser = CT.Class({
	CLASSNAME: "blog.vcfg.Browser",
	saver: function(d, prop, val) {
		var edited = this._.edited, eopts = {};
		d[prop] = eopts[prop] = val;
		if (d.key)
			eopts.key = d.key;
		else
			eopts.modelName = d.modelName;
		blog.vcfg.vz(function(upd) {
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
			this.filer.file(d)
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
		this._.tagged = {}
		this.tagger = new blog.vcfg.Tagger({
			saver: this.saver
		});
		this.filer = new blog.vcfg.Filer({
			saver: this.saver,
			allvids: opts.allvids
		});
	}
}, CT.Browser);