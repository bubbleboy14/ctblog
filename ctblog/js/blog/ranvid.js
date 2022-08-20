var rcfg = core.config.ctblog.index.ranvid || {};

blog.ranvid = {
	_: {
		playlist: [],
		channel: null,
		stat: CT.dom.img(rcfg.static, "abs full mosthigh"),
		glit: CT.dom.img(rcfg.glitch, "abs full mosthigh")
	},
	set: function(v) {
		CT.log(v);
		var _ = blog.ranvid._;
		_.vid.src = v;
		_.stat.onclick = function() {
			_.vid.paused && _.vid.play();
		};
		_.vid.onclick = function() {
			CT.clipboard(location.protocol + "//" + location.host + v);
		};
		_.vid.onerror = function() {
			CT.dom.setMain(_.glit);
			rcfg.fix ? CT.net.post({
				path: "/_vproc",
				params: {
					action: "mp4",
					vpath: v
				},
				cb: () => blog.ranvid.set(v)
			}) : setTimeout(blog.ranvid.randize, 2000);
		};
		CT.dom.addContent("ctmain", _.vid);
	},
	get: function(cb) {
		CT.net.post({
			path: "/_blog",
			params: {
				action: "ranvid",
				channel: blog.ranvid._.channel
			},
			cb: cb || blog.ranvid.set
		});
	},
	randize: function() {
		var _ = blog.ranvid._;
		CT.dom.setMain(_.stat);
		if (_.playlist.length)
			return blog.ranvid.set("/v/" + _.playlist.shift() + ".mp4");
		blog.ranvid.get();
	},
	init: function() {
		var _ = blog.ranvid._, h = location.hash.slice(1);
		if (h) {
			location.hash = "";
			if (h.startsWith("~"))
				_.channel = h.slice(1);
			else
				_.playlist = _.playlist.concat(h.split("~"));
		}
		_.vid = CT.dom.video({
			autoplay: true,
			className: "full",
			onended: blog.ranvid.randize,
			onplay: function() {
				CT.dom.remove(_.stat);
				CT.dom.remove(_.glit);
			}
		});
		blog.ranvid.randize();
	}
};