blog.vcfg.util = {
	_: {
		tag: function(cb) {
			var _ = blog.vcfg.util._;
			CT.modal.prompt({
				prompt: "ok, what's the tag?",
				cb: function(tname) {
					blog.getters.tag(name, function(tdata) {
						CT.data.add(tdata);
						_.tags.push(tdata);
						cb();
					}, cb);
				}
			})
		}
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
			blog.getters.videos(bvu.build);
		});
	}
};