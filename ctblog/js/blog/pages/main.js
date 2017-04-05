CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	if (core.config.ctblog.index.onload)
		core.config.ctblog.index.onload();
	if (core.config.ctblog.index.latest_vid) {
		blog.core.db.latest(function(d) {
			CT.net.post({
				path: "/_vproc",
				params: {
					v: d[0].key,
					check: true
				},
				cb: function(hls) {
					var opts = {
						controls: true,
						poster: d[0].poster || core.config.ctblog.post.poster
					};
					if (!CT.info.androidTablet)
						opts.autoplay = true;
					CT.dom.setContent("ctmain",
						CT.dom.video(((CT.info.iOs || CT.info.androidTablet) && hls)
							? d[0].video.replace("/blob/", "/blob/hls/") + "/list.m3u8"
							: d[0].video, "full", null, opts));
				}
			});
		});
	}
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