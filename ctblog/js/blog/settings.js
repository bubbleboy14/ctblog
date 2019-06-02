blog.settings = {
	_: {
		switcheroo: CT.dom.div(null, "h1 centered"),
		isDiff: function(ccdude) {
			var ccfg = user.core.get("cc"),
				cur = ccfg && ccfg.person;
			return (!ccdude != !cur) && (ccdude != cur);
		},
		shouldSwitch: function(ccdude) {
			return blog.settings._.isDiff(ccdude) && confirm("update your associated carecoin account?");
		},
		up: function(cc) {
			var upd = { cc: cc };
			CT.net.post({
				path: "/_user",
				params: {
					action: "edit",
					user: user.core.get("key"),
					changes: upd
				}
			});
			user.core.update(upd);
			blog.settings._.setSwitcher();
		},
		switched: function(data) {
			var _ = blog.settings._, ccfg = core.config.ctblog.CC,
				ccdata = data.data;
			if (data.action == "switch") {
				CT.log("you are now " + (ccdata || "no one"));
				if (_.shouldSwitch(ccdata)) {
					if (ccdata) {
						_.ccdude = ccdata;
						_.switcher.enroll({
							agent: ccfg.agent,
							pod: ccfg.pod
						});
					} else
						_.up();
				}
			} else if (data.action == "enrollment") {
				_.up({
					person: _.ccdude,
					membership: ccdata
				});
			}
		},
		setSwitcher: function(switchIt) {
			var _ = blog.settings._, ccfg = user.core.get("cc"),
				p = ccfg && ccfg.person;
			if (switchIt) {
				CT.dom.clear(_.switcheroo);
				_.switcher = CC.switcher(_.switcheroo, _.switched);
			} else {
				CT.dom.setContent(_.switcheroo, CT.dom.div([
					"Associated carecoin Account: " + (p || "none"),
					CT.dom.button("switch it up", function() {
						_.setSwitcher(true);
					})
				], "biggerest bigpadded down30"));
			}
		}
	},
	switcher: function() {
		var _ = blog.settings._;
		_.setSwitcher();
		return _.switcheroo;
	},
	init: function() {
		CT.dom.setContent("ctmain", CT.dom.div([
			CT.dom.div("Your <b>carecoin</b> Membership", "bigger centered"),
			CT.dom.div(blog.settings.switcher(), "h170p p0 noflow")
		], "bordered padded margined round"));
	}
};