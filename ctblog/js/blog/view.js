blog.view = {
	_: {
		get: function() {
			var _ = blog.view._;
			if (!_.viewer)
				_.viewer = CC.viewer();
			return _.viewer;
		},
		emit: function(memship, identifier, agent) {
			blog.view._.get().view({
				agent: agent,
				content: {
					membership: memship,
					identifier: identifier
				}
			});
		},
		local: function(p, a) {
			CT.require("comp.core", "skip");
			comp.core.c({
				action: "view",
				agent: a,
				content: {
					blogger: p.user,
					identifier: p.title
				}
			});
		},
		view: function(p) {
			var ccfg = core.config.CC,
				memship = ccfg && ccfg.membership,
				_ = blog.view._;
			if (core.config.ctcomp)
				_.local(p, ccfg.agent);
			else if (ccfg && ccfg.agent && ccfg.pod) { // else no individual memberships
				CT.db.one(p.user, function(author) {
					_.emit(author.cc && author.cc.membership || memship,
						p.title, ccfg.agent);
				});
			} else if (memship)
				_.emit(memship, p.title);
		}
	},
	simple: function(title) {
		var ccfg = core.config.CC,
			memship = ccfg && ccfg.membership,
			_ = blog.view._;
		memship && _.emit(memship, title);
	},
	viewable: function(p) {
		var n = blog.core.util.post(p);
		n.on("visible", function() {
			CT.log("viewed: " + p.title + " " + p.key);
			blog.view._.view(p);
		});
		return n;
	}
};