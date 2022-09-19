CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.ranvid");

var mode = location.hash.slice(1) || "v"; // || i
var cont = CT.dom.div(null, "centered");
var vid = function(v) {
	CT.dom.addContent(cont, CT.dom.video({
		src: v,
		controls: true,
		className: "h200p inline-block"
	}));
};
var refill = function(num) {
	num = num || 10;
	if (mode == "i") {
		CT.net.post({
			path: "/_blog",
			params: {
				action: "imgz",
				count: num
			},
			cb: function(iz) {
				iz.map(i => CT.dom.addContent(cont,
					CT.dom.img("/img/z/" + i, "h200p")))
			}
		});
	} else
		for (var i = 0; i < num; i++)
			blog.ranvid.get(vid);
};

CT.onload(function() {
	CT.initCore();
	refill(20);
	CT.dom.setMain([
		cont,
		CT.dom.div({
			content: "loading...",
			onvisible: refill
		})
	]);
});