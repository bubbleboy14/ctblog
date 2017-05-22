CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		posts.reverse();
		if (core.config.ctblog.post.tabbed) {
			new CT.slider.Slider({
				frames: posts,
				noStyle: true,
				autoSlide: false,
				parent: "ctmain",
				arrowPosition: "bottom",
				bubblePosition: "bottom",
				frameCb: blog.core.util.post
			});
		} else
			CT.dom.setContent("ctmain", posts.map(blog.core.util.post));
	}, true);
});