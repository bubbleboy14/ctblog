CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");
if (!blog.core.util._user)
	location = "/";

CT.onload(function() {
	CT.initCore();
	var content = CT.dom.node(null, null, "ctcontent"),
		tlist = CT.dom.node(null, null, "ctlist"),
		blurs = core.config.ctblog.post.blurs,
		title = CT.dom.smartField({ blurs: blurs.title, classname: "w1"}),
		blurb = CT.dom.smartField({ blurs: blurs.blurb, classname: "w1 h200p", isTA: true }),
		body = CT.dom.smartField({ blurs: blurb.body, classname: "w1 h500p", isTA: true }),
		submit = CT.dom.button("Submit", function() {
			if (!title.value || !blurb.value || !body.value)
				return alert("please complete all fields");
			var pdata = {
				user: blog.core.util._user.key,
				title: title.value,
				blurb: blurb.value,
				body: body.value
			};
			CT.net.post("/_blog", CT.merge({
				action: "post"
			}, pdata), null, function(key) {
				pdata.key = key;
				pdata.label = pdata.title;
				var t = CT.panel.trigger(pdata, viewPost);
				if (tlist.firstChild.nextSibling)
					tlist.insertBefore(t, tlist.firstChild.nextSibling);
				else
					tlist.appendChild(t);
				t.trigger();
			});
		}), viewPost = function(p) {
			CT.dom.setContent(content, CT.dom.node([ title, blurb,
				body, submit ], "div", "bordered padded round"));
		};
	blog.core.db.posts(function(posts) {
		CT.panel.triggerList(posts, viewPost, tlist);
		CT.dom.setContent("ctmain", [ tlist, content ]);
	}, false, true);
});