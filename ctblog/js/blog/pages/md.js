CT.require("CT.all");
CT.require("core");
CT.require("blog.view");
CT.scriptImport("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
var cfg = core.config,
	ccfg = cfg.CC,
	mcfg = cfg.ctblog.md;
if (ccfg && ccfg.gateway)
	CT.scriptImport(ccfg.gateway);

var poLine = function(line) {
	if (line.startsWith("#"))
		return line;
	return line + "\\";
};

var poetrize = function(text) {
	return text.split("\n").map(poLine).join("\n").slice(0, -1);
};
var proc = function(text) {
	var stag, etag, srep, erep = "</span>";
	if (mcfg.poetry)
		text = poetrize(text);
	for (color of ["red", "green", "blue", "yellow", "purple", "magenta"]) {
		stag = "!" + color + "!";
		etag = "!no" + color + "!";
		srep = "<span style='color:" + color + ";'>";
		while (text.includes(stag))
			text = text.replace(stag, srep).replace(etag, erep);
	}
	return marked.marked(text.replace(/\n\n"""\n/g,
		"<div class='big blockquote'>").replace(/\n"""\n\n/g, "</div>").replace(/\n\n'''\n/g,
		"<div class='big blockquote bottommargined up30 noflow hoverglow hmaxtrans hm0'>").replace(/\n'''\n\n/g,
		"</div>").replace(/\n\n;;;\n/g, "<div class='mdchart'>").replace(/\n;;;\n\n/g,
		"</div>").replace(/\n\nttt\n/g, "<div class='mdtimeline'>").replace(/\nttt\n\n/g, "</div>"));
};

var ytFix = function(iframe) {
	iframe.parentNode.className = "vidbox";
};
var expando = function(e) {
	var expander = CT.dom.link("click here to expand", function() {
		var xed = expander._expanded = !expander._expanded;
		e.classList[xed ? "add" : "remove"]("hmaxmax");
		CT.dom.setContent(expander, "click here to " + (xed ? "contract" : "expand"));
	}, null, "bigger block hoverglow centered");
	e.parentNode.insertBefore(expander, e);
};
var buildChart = function(n) {
	var d = n.innerHTML, lz, rz;
	[lz, rz] = d.slice(1, -4).replace(/<p><\/p>    <p> /g, "<p></p>  <p> ").split("<p></p>  <p> ");
	n.innerHTML = "";
	new Chartist.Line(n, {
		labels: lz.split(", "),
		series: rz.split("</p>  <p> ").map(r => r.split(", ").map(i => parseInt(i)))
	}, {
		fullWidth: true,
		chartPadding: {
			right: 40
		}
	});
};
var charts = function() {
	var cz = CT.dom.className("mdchart");
	if (!cz.length) return;
	CT.dom.addStyle(null, "https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css");
	CT.scriptImport("https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js", function() {
		cz.forEach(buildChart);
	});
};
var buildTimeline = function(n) {
	var line, parts, start, shift, pshift, pin, bar, pins = [],
		bars = [], lines = n.innerHTML.replace(/   /g, "  ").split("  ").slice(1);
	for (line of lines) {
		parts = line.split(" ");
		start = parts[0];
		if (start == "shift") {
			parts.shift();
			shift = parseInt(parts.shift());
			if (parts.length)
				pshift = parseInt(parts.shift());
		} else if (start == "pin") {
			pin = {};
			parts.shift();
			pin.date = parseInt(parts.shift());
			pin.icon = parts.shift();
			pin.name = parts.join(" ");
			pins.push(pin);
		} else {
			bar = {};
			bar.color = parts.shift();
			bar.width = parseInt(parts.shift());
			bar.start = parseInt(parts.shift());
			bar.name = parts.join(" ");
			bars.push(bar);
		}
	}
	CT.dom.setContent(n, CT.dom.timeline(bars, pins, shift, pshift));
};
var timelines = function() {
	CT.dom.className("mdtimeline").forEach(buildTimeline);
};

var hlfix = function(atag) {
	atag.onclick = function() {
		location = atag.href;
		atag.href.includes("#") && location.reload();
	}
};

var exper = function(label, node) {
	var enode = CT.dom.link("-" + label, function(e) {
		e.stopPropagation();
		CT.dom.showHide(node);
		enode._hidden = !enode._hidden;
		CT.dom.setContent(enode, (enode._hidden ? "+" : "-") + label);
	}, null, "right italic green");
	return enode;
};

var chaps = {};

var scroll2chap = function(name) {
	var n = chaps[name], f;
	if (!n) return console.log("chapter not found:", name);
	f = function() {
		n.scrollIntoView({
			behavior: "smooth"
		});
	};
	f();
	setTimeout(f, 1000);
	setTimeout(f, 2000);
	setTimeout(f, 3000);
	setTimeout(f, 4000);
	setTimeout(f, 5000);
};

var clipsec = function(chap) {
	var l = location, b = l.protocol + "//" + l.host + l.pathname,
		u = b + "?n=" + CT.info.query.n;
	if (chap)
		u += "&c=" + encodeURIComponent(chap);
	CT.clipboard(u);
};

var jtoclink = function(h2node) {
	var name = h2node.innerHTML;
	chaps[name] = h2node;
	h2node.classList.add("pointer");
	h2node.onclick = () => clipsec(name);
	return CT.dom.link(name, () => scroll2chap(name),
		null, "hoverglow pointer block");
};

var jtoc = function() {
	var tnode = CT.dom.tag("h1").pop(), toc, topper;
	if (!tnode) return;
	toc = CT.dom.div(CT.dom.tag("h2").map(jtoclink));
	topper = CT.dom.div(tnode.innerHTML, "big pointer");
	topper.onclick = () => clipsec();
	return CT.dom.div([
		exper("page [toc]", toc),
		topper,
		toc
	], "bottommargined");
};

var jnavlink = function(name) {
	return CT.dom.link(name, function() {
		location = "/blog/md.html?n=" + name;
	}, null, "hoverglow pointer block");;
};

var jnav = function() {
	var n = CT.dom.div();
	CT.net.post({
		path: "/_blog",
		params: {
			action: "md"
		},
		cb: mdz => CT.dom.setContent(n, mdz.map(jnavlink))
	});
	return [CT.dom.div(exper("site [nav]", n), "right italic"), n];
};

var loadjmenu = function() {
	var cont = [];
	mcfg.toc && cont.push(jtoc());
	mcfg.nav && cont.push(jnav());
	jmenu._men = CT.modal.modal(cont, null, {
		center: false,
		noClose: true,
		className: "basicpopup scroller",
		slide: {
			origin: "bottomright"
		}
	}, true, true);
};

var jmenu = function() {
	jmenu._men.show();
};

var jumpers = function() {
	loadjmenu();
	CT.dom.addBody(CT.dom.link("jump", jmenu, null,
		"abs cbr big bold padded margined hoverglow grayback-trans round right20"));
};

var h2fix = function(n) {
	var cont = [], realH2, notblock = n.parentNode.className != "big blockquote";
//	console.log(n.lastChild.data);
	if (notblock && !n.children.length) return;
//	console.log("PROCESSING", n.children.length, n.parentNode.className);
	if (n.children.length && notblock) {
		realH2 = CT.dom.node(n.lastChild.data, "h2");
		n.lastChild.remove();
	}
	cont.push(CT.dom.div(n.innerHTML));
	realH2 && cont.push(realH2);
	n.replaceWith(CT.dom.div(cont));
};

CT.onload(function() {
	CT.initCore();
	mcfg.video && CT.parse.enableVideo();
	var q = CT.info.query, h = q.n || location.hash.slice(1), c = q.c;
	fetch("/md/" + h + ".md").then(d => d.text()).then(function(text) {
		if (text.startsWith("<b>404</b>"))
			CT.dom.setMain(CT.dom.div("can't find it!", "centered"));
		else {
			document.head.getElementsByTagName("title")[0].innerHTML = h;
			blog.view.simple(h);
			CT.dom.setMain(CT.parse.process(proc(text)));
			CT.dom.tag("iframe").forEach(ytFix);
			CT.dom.Q("a[href^='" + location.origin + location.pathname + "']").forEach(hlfix);
			CT.dom.className("hmaxtrans").forEach(expando);
			CT.dom.tag("h2").forEach(h2fix);
			charts();
			timelines();
		}
		(mcfg.toc || mcfg.nav) && jumpers();
		c && scroll2chap(c);
	});
});