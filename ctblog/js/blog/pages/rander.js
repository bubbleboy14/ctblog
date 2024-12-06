CT.require("CT.all");
CT.require("core");

window.addEventListener("message", function(evt) {
	var d = evt.data, oz = { action: "ranvid" };
	if (d.data)
		oz.channel = d.data;
	(d.action == "send") && window.parent.postMessage({
		action: "rand",
		data: CT.net.get("/_blog", oz, false, true)
	}, evt.origin);
});