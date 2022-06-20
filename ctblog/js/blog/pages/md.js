CT.require("CT.all");
CT.require("core");
CT.scriptImport("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
var cfg = core.config.ctblog.md;

var poLine = function(line) {
	if (line.startsWith("#"))
		return line;
	return line + "\\";
};

var poetrize = function(text) {
	return text.split("\n").map(poLine).join("\n").slice(0, -1);
};
var proc = function(text) {
	if (cfg.poetry)
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
	[lz, rz] = d.slice(1, -4).split("<p></p>  <p> ");
	n.innerHTML = "";
	new Chartist.Line(n, {
		labels: lz.split(", "),
		series: rz.split("</p>  <p> ").map(r => r.split(", ").map(i => parseInt(i)))
	}, {
		fullWidth: true
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

CT.onload(function() {
	CT.initCore();
	cfg.video && CT.parse.enableVideo();
	var h = location.hash.slice(1);
	fetch("/md/" + h + ".md").then(d => d.text()).then(function(text) {
		if (text.startsWith("<b>404</b>"))
			CT.dom.setMain(CT.dom.div("can't find it!", "centered"));
		else {
			CT.dom.setMain(CT.parse.process(proc(text)));
			CT.dom.tag("iframe").forEach(ytFix);
			CT.dom.className("hmaxtrans").forEach(expando);
			charts();
		}
	});
});