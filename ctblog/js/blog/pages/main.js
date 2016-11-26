CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	if (core.config.ctblog.index.onload)
		core.config.ctblog.index.onload();
	if (core.config.ctblog.index.blurb)
		CT.dom.setContent("ctmain",
			CT.dom.node(core.config.ctblog.index.blurb,
				"div", "blockquote"));
	if (core.config.ctblog.index.slider.length) {
		var snode = CT.dom.node(null, null, "abs bottom0 w1 h200p");
		CT.dom.addContent(document.body, snode);
		document.body.classList.add("footered");
		new CT.slider.Slider({
			parent: snode,
			navButtons: false,
			panDuration: 10000,
			frames: core.config.ctblog.index.slider
		});
	}
});