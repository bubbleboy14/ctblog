CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		posts.reverse();
		if (core.config.ctblog.post.tabbed) {
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