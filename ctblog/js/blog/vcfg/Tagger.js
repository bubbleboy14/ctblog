blog.vcfg.Tagger = CT.Class({
	CLASSNAME: "blog.vcfg.Tagger",
	edit: function(d) {
		blog.vcfg.util.tag(d, tags => this.saver(d, "tags", tags));
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