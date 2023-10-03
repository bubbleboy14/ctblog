CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.getters");
CT.require("blog.Scanner");
CT.require("blog.vcfg");
CT.net.setSpinner(true);

CT.onload(function() {
	CT.initCore();
	blog.vcfg.util.init();
});