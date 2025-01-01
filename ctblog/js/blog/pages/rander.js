CT.require("CT.all");
CT.require("core");

var amap = {
	list: "vz",
	rand: "ranvid"
};

window.addEventListener("message", function(evt) {
	var d = evt.data, paction = amap[d.action];
	var send = function(data) {
		window.parent.postMessage({
			action: d.action,
			data: data
		}, evt.origin);
	}, retrieve = function() {
		var oz = { action: paction };
		if (d.data)
			oz.channel = d.data;
		return CT.net.get("/_blog", oz, false, true);
	};
	paction && send(retrieve());
});