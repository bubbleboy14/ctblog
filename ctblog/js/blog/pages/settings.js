CT.require("CT.all");
CT.require("core");
CT.require("CT.cc");
CT.require("user.core");

CT.onload(function() {
	CT.initCore();
	new CT.cc.Switcher();
});