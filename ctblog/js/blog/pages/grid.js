CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.ranvid");
CT.require("blog.getters");
CT.require("blog.Scanner");

var mode = location.hash.slice(1) || "v"; // || i
var variety = {i:"image",v:"video"}[mode];
var othervar = {i:"videos",v:"images"}[mode];
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
		blog.getters.images(function(iz) {
			iz.map(i => CT.dom.addContent(cont,
				CT.dom.img("/img/z/" + i, "h200p")));
		}, num);
	} else
		for (var i = 0; i < num; i++)
			blog.ranvid.get(vid);
};

var swapMode = function() {
	if (variety == "video")
		location.hash = "i";
	else
		location.hash = "v";
	location.reload();
};

var miniMenu = function() {
	var scanner = new blog.Scanner({
		variety: variety
	});
	return CT.dom.div([
		CT.dom.link(othervar, swapMode),
		CT.dom.span("|"),
		CT.dom.link("scan", scanner.nav)
	], "fixed cbr pr10");
};

CT.onload(function() {
	CT.initCore();
	refill(20);
	CT.dom.setMain([
		cont,
		CT.dom.div({
			content: "loading...",
			onvisible: refill
		}),
		miniMenu()
	]);
});