CT.require("CT.all");
CT.require("core");
CT.scriptImport("https://cdn.jsdelivr.net/npm/marked/marked.min.js");

var proc = function(text) {
	return marked(text.replace(/\n\n"""\n/g,
		"<div class='big blockquote'>").replace(/\n"""\n\n/g, "</div>"));
};

CT.onload(function() {
	CT.initCore();
	CT.parse.enableVideo():
	var h = location.hash.slice(1);
	fetch("/md/" + h + ".md").then(d => d.text()).then(function(text) {
		if (text.startsWith("<b>404</b>"))
			CT.dom.setMain(CT.dom.div("can't find it!", "centered"));
		else
			CT.dom.setMain(CT.parse.process(proc(text)));
	});
});