CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");
CT.require("blog.settings");
CT.scriptImport(core.config.ctblog.CC.gateway);

CT.onload(function() {
	CT.initCore();
	blog.settings.init();
});