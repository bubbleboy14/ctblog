CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		var cfg = core.config.ctblog.post;
		posts.reverse();
		if (cfg.tags && cfg.tags.length) {
			var categories = {};
			posts.forEach(function(post) {
				post.tags.forEach(function(tag) {
					var cat = categories[tag]
						= categories[tag] || { label: tag, posts: [] };
					cat.posts.push(post);
				});
			});
			var cats = Object.values(categories), slider = new CT.slider.Slider({
				frames: cats,
				noStyle: true,
				autoSlide: false,
				parent: "ctmain",
				arrowPosition: "bottom",
				bubblePosition: "bottom",
				frameCb: function(cat) {
					return cat.posts.map(blog.core.util.post);
				}, tab: {
					origin: "topright",
					content: CT.dom.img({
						src: "/img/clipboard.png",
						style: {
							width: "60px",
							padding: "15px 15px 0px 0px"
						},
						onclick: function() {
							var h = encodeURIComponent(cats[slider.index].label);
							CT.clipboard(document.location + "#" + h);
						}
					})
				},
				startFrame: decodeURIComponent(document.location.hash.slice(1))
			});
		} else if (cfg.tabbed) {
			var slider = new CT.slider.Slider({
				frames: posts,
				noStyle: true,
				autoSlide: false,
				parent: "ctmain",
				arrowPosition: "bottom",
				bubblePosition: "bottom",
				frameCb: blog.core.util.post,
				tab: {
					origin: "topright",
					content: CT.dom.img({
						src: "/img/clipboard.png",
						style: {
							width: "60px",
							padding: "15px 15px 0px 0px"
						},
						onclick: function() {
							var h = encodeURIComponent(posts[slider.index].label);
							CT.clipboard(document.location + "#" + h);
						}
					})
				},
				startFrame: decodeURIComponent(document.location.hash.slice(1))
			});
		} else
			CT.dom.setContent("ctmain", posts.map(blog.core.util.post));
	}, true);
});