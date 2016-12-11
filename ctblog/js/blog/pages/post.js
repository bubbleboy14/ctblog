CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	var content = CT.dom.node(null, null, "ctcontent"),
		tlist = CT.dom.node(null, null, "ctlist"),
		blurs = core.config.ctblog.post.blurs,
		editPost = function(p) {
			var tmode = core.config.ctblog.post.mode == "text";
			if (p.label == blog.core.util._newPost)
				return CT.db.withSchema(function(schema) {
					editPost(CT.db.edit.getDefaults(tmode ? "post" : "videopost"));
				});
			var title = CT.dom.smartField({ blurs: blurs.title, value: p.title, classname: "w1" }),
				media = CT.db.edit.media({ data: p, mediaType: tmode && "img" || "video", className: "wm400p" }),
				blurb = CT.dom.smartField({ blurs: blurs.blurb, value: p.blurb, classname: "w1 h100p", isTA: true }),
				body = CT.dom.smartField({ blurs: blurs.body, value: p.body, classname: "w1 h400p", isTA: true }),
				live = CT.dom.checkboxAndLabel("Go Live", p.live, null, "pointer", "right"),
				cnodes = [title, p.key ? media : CT.dom.div("(upload media next -- first, click submit!)", "small")];
			if (core.config.ctblog.post.blurb)
				cnodes.push(blurb);
			if (tmode)
				cnodes.push(body);
			cnodes.push(live);
			cnodes.push(CT.dom.button("Submit", function() {
				if (!title.value || (core.config.ctblog.post.blurb && !blurb.value)
					|| (tmode && !body.value))
					return alert("please complete all fields");
				var pdata = {
					user: blog.core.util._user.key,
					title: title.value,
					live: live.firstChild.checked
				};
				if (core.config.ctblog.post.blurb)
					pdata.blurb = blurb.value;
				if (tmode)
					pdata.body = body.value;
				CT.net.post("/_blog", CT.merge({
					action: tmode && "post" || "videopost",
					key: p.key
				}, pdata), null, function(key) {
					var d = CT.data.get(key);
					if (!d) {
						d = pdata;
						d.key = key;
						d.label = d.title;
						CT.data.add(d);
						var t = CT.panel.trigger(d, editPost);
						if (tlist.firstChild.nextSibling)
							tlist.insertBefore(t, tlist.firstChild.nextSibling);
						else
							tlist.appendChild(t);
						t.trigger();
					} else {
						for (var pd in pdata)
							p[pd] = pdata[pd];
						if (p.title != p.label)
							p.node.rename(p.title);
					}
				});
			}));
			CT.dom.setContent(content, CT.dom.div(cnodes, "bordered padded round"));
		};
	blog.core.db.posts(function(posts) {
		CT.data.addSet(posts);
		posts.unshift({
			label: blog.core.util._newPost
		});
		CT.panel.triggerList(posts, editPost, tlist);
		tlist.firstChild.trigger();
		CT.dom.setContent("ctmain", [ tlist, content ]);
	}, false, true);
});