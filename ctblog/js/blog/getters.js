blog.getters = {
	_get: function(cb, params, eb) {
		CT.net.post({
			path: "/_blog",
			params: params,
			cb: cb,
			eb: eb
		});
	},
	videos: function(cb, subset, vinfo, eb) {
		var params = { action: "vz" };
		if (vinfo)
			params.vinfo = vinfo;
		if (subset) {
			var realCb = cb;
			cb = vz => realCb(vz[subset]);
		}
		blog.getters._get(cb, params, eb);
	},
	images: function(cb, eb) {
		blog.getters._get(cb, {
			action: "imgz"
		}, eb);
	},
	tag: function(name, cb, eb) {
		blog.getters._get(cb, {
			action: "tz",
			name: name
		}, eb);
	}
};