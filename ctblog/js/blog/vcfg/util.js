blog.vcfg.util = {
	_: {
		tag: function(cb) {
			var bvu = blog.vcfg.util, _ = bvu._;
			CT.modal.prompt({
				prompt: "ok, what's the tag?",
				cb: function(tname) {
					bvu.vz(function(tdata) {
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
		var bvu = blog.vcfg.util, _ = bvu._;
		CT.modal.choice({
			prompt: "please select your tags",
			style: "multiple-choice",
			data: ["new tag"].concat(_.tags),
			selections: d.tags.map(t => CT.data.get(t).name),
			cb: function(tags) {
				if (tags[0] == "new tag")
					return _.tag(() => bvu.tag(d, cb));
				cb(tags.map(t => t.key));
			}
		});
	},
	build: function(videos) { // {all[],tagged[]}
		var bv = blog.vcfg;
		bv.util._.browser = new bv.Browser({
			videos: videos
		});
	},
	init: function() {
		var bvu = blog.vcfg.util, _ = bvu._;
		CT.db.get("tag", function(tags) {
			_.tags = tags;
			bvu.vz(bvu.build);
		});
	}
};