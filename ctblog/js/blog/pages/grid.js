CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.ranvid");

var vidz = CT.dom.div(null, "centered");
var vid = function(v) {
	CT.dom.addContent(vidz, CT.dom.video({
		src: v,
		controls: true,
		className: "h200p inline-block"
	}));
};
var refill = function(num) {
	num = num || 4;
	for (var i = 0; i < num; i++)
		blog.ranvid.get(vid);
};

CT.onload(function() {
	CT.initCore();
	refill(8);
	CT.dom.setMain([
		vidz,
		CT.dom.div({
			content: "loading...",
			onvisible: refill
		})
	]);
});