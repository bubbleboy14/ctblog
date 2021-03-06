CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");
CT.require("blog.view");
var ccfg = core.config.CC;
if (ccfg && ccfg.gateway)
	CT.scriptImport(ccfg.gateway);

var setSlide = function(collection, frameCb) {
	var slider = new CT.slider.Slider({
		frames: collection,
		noStyle: true,
		autoSlide: false,
		parent: "ctmain",
		arrowPosition: "bottom",
		bubblePosition: "bottom",
		frameCb: frameCb,
		tab: {
			origin: "topright",
			content: CT.dom.img({
				src: "/img/clipboard.png",
				style: {
					width: "60px",
					padding: "15px 15px 0px 0px"
				},
				onclick: function() {
					var h = encodeURIComponent(collection[slider.index].label);
					CT.clipboard(document.location + "#" + h);
				}
			})
		},
		startFrame: decodeURIComponent(document.location.hash.slice(1))
	});
};

CT.onload(function() {
	CT.initCore();
	blog.core.db.posts(function(posts) {
		if (!posts.length) {
			return CT.dom.setContent("ctmain", CT.dom.div([
				CT.dom.span("nothing yet! click"),
				CT.dom.pad(),
				CT.dom.link("here", null, "/blog/post.html"),
				CT.dom.pad(),
				CT.dom.span("to post the first article!")
			], "centered"));
		}
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
			setSlide(Object.values(categories), function(cat) {
				return cat.posts.map(blog.view.viewable);
			});
		} else if (cfg.tabbed)
			setSlide(posts, blog.view.viewable);
		else
			CT.dom.setContent("ctmain", posts.map(blog.view.viewable));
	}, true);
});