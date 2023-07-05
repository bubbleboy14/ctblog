CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	var cfg = core.config.ctblog.about;
	if (cfg.blurb)
		CT.dom.setContent("ctmain",
			CT.dom.div(cfg.blurb, cfg.blurbClass || "blockquote"));
	if (cfg.slider.length) {
		var snode = CT.dom.node(null, null, core.config.ctblog.slider_class);
		CT.dom.addContent(document.body, snode);
		document.body.classList.add("footered");
		new CT.slider.Slider({
			parent: snode,
			navButtons: false,
			panDuration: 10000,
			frames: cfg.slider
		});
	}
	if (cfg.extra)
		CT.dom.addContent("ctmain", cfg.extra());
});