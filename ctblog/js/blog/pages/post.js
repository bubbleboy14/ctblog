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
			if (p.label == blog.core.util._newPost)
				return CT.db.withSchema(function(schema) {
					editPost(CT.db.edit.getDefaults("post"));
				});
			var title = CT.dom.smartField({ blurs: blurs.title, value: p.title, classname: "w1" }),
				img = CT.db.edit.img({ data: p }),
				blurb = CT.dom.smartField({ blurs: blurs.blurb, value: p.blurb, classname: "w1 h100p", isTA: true }),
				body = CT.dom.smartField({ blurs: blurs.body, value: p.body, classname: "w1 h400p", isTA: true }),
				live = CT.dom.checkboxAndLabel("Go Live", p.live, null, "pointer", "right");
			CT.dom.setContent(content, CT.dom.node([title, img, blurb, body, live, CT.dom.button("Submit", function() {
				if (!title.value || !blurb.value || !body.value)
					return alert("please complete all fields");
				var pdata = {
					user: blog.core.util._user.key,
					title: title.value,
					blurb: blurb.value,
					body: body.value,
					live: live.firstChild.checked
				};
				CT.net.post("/_blog", CT.merge({
					action: "post",
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
			})], "div", "bordered padded round"));
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