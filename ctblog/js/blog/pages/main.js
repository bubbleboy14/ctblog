CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

var mdnode = function(md) {
	return CT.dom.link(md, null, "/blog/md.html#" + md, "big block");
};

CT.onload(function() {
	CT.initCore();
	var cfg = core.config.ctblog.index;
	cfg.onload && cfg.onload();
	cfg.latest && blog.core.util.latest();
	cfg.blurb && CT.dom.setMain(CT.dom.div(cfg.blurb, cfg.blurbClass || "blockquote"));
	cfg.md && CT.net.post({
		path: "/_blog",
		params: { action: "md" },
		cb: mdz => CT.dom.addContent("ctmain", CT.dom.div(mdz.map(mdnode), "centered"))
	});
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
});