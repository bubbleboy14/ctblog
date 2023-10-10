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
	if (mcfg.poetry)
		text = poetrize(text);
	return marked.marked(text.replace(/\n\n"""\n/g,
		"<div class='big blockquote'>").replace(/\n"""\n\n/g, "</div>").replace(/\n\n'''\n/g,
		"<div class='big blockquote bottommargined up30 noflow hoverglow hmaxtrans hm0'>").replace(/\n'''\n\n/g,
		"</div>").replace(/\n\n;;;\n/g, "<div class='mdchart'>").replace(/\n;;;\n\n/g, "</div>"));
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

var hlfix = function(atag) {
	atag.onclick = function() {
		location = atag.href;
		location.reload();
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

var jtoclink = function(h2node) {
	return CT.dom.link(h2node.innerHTML, function() {
		h2node.scrollIntoView({
			behavior: "smooth"
		});
	}, null, "hoverglow pointer block");
};

var jtoc = function() {
	var tnode = CT.dom.tag("h1").pop(), toc;
	if (!tnode) return;
	toc = CT.dom.div(CT.dom.tag("h2").map(jtoclink));
	return CT.dom.div([
		exper("page [toc]", toc),
		CT.dom.div(tnode.innerHTML, "big"),
		toc
	], "bottommargined");
};

var jnavlink = function(name) {
	return CT.dom.link(name, function() {
		location = "/blog/md.html#" + name;
		location.reload();
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

var jmenu = function() {
	var cont;
	if (!jmenu._men) {
		cont = [];
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
	}
	jmenu._men.show();
};

var jumpers = function() {
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
	var h = location.hash.slice(1);
	fetch("/md/" + h + ".md").then(d => d.text()).then(function(text) {
		if (text.startsWith("<b>404</b>"))
			CT.dom.setMain(CT.dom.div("can't find it!", "centered"));
		else {
			blog.view.simple(h);
			CT.dom.setMain(CT.parse.process(proc(text)));
			CT.dom.tag("iframe").forEach(ytFix);
			CT.dom.Q("a[href^='" + location.origin + location.pathname + "']").forEach(hlfix);
			CT.dom.className("hmaxtrans").forEach(expando);
			CT.dom.tag("h2").forEach(h2fix);
			charts();
		}
		(mcfg.toc || mcfg.nav) && jumpers();
	});
});