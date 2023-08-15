CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.vcfg");

CT.onload(function() {
	CT.initCore();
	blog.vcfg.init();
});