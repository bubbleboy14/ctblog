CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("blog.core");
CT.require("blog.view");
var cfg = core.config,
	ccfg = cfg.CC,
	ctbcfg = cfg.ctblog,
	pcfg = ctbcfg.post,
	bcfg = ctbcfg.blog,
	lochash = decodeURIComponent(document.location.hash.slice(1));
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
		tab: pcfg.clip && {
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
		startFrame: lochash
	});
};

CT.onload(function() {
	CT.initCore();
	var variety, filters = {};
	if (pcfg.mode == "basepost" && ["post", "videopost", "photoset"].includes(lochash)) {
		variety = lochash;
		lochash = null;
	} else if (pcfg.tags.includes(lochash)) {
		filters.tags = {
			comparator: "contains",
			value: lochash
		};
		document.body.classList.add("blog-" + lochash);
		lochash = null;
	} else if (lochash.startsWith("q:")) {
		filters.searcher = {
			comparator: "like",
			value: "%" + lochash.slice(2) + "%"
		};
		lochash = null;
	}
	blog.core.db.posts(function(posts) {
		if (!posts.length) {
			CT.dom.setMain(CT.dom.div([
				CT.dom.span("nothing yet! click"),
				CT.dom.pad(),
				CT.dom.link("here", null, "/blog/post.html"),
				CT.dom.pad(),
				CT.dom.span("to post the first article!")
			], "centered p50"));
			bcfg.searcher && blog.core.util.searcher();
			return;
		}
		posts.reverse();
		if (pcfg.tags && pcfg.tags.length) {
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
		} else if (pcfg.tabbed)
			setSlide(posts, blog.view.viewable);
		else
			CT.dom.setContent("ctmain", posts.map(blog.view.viewable));
		bcfg.searcher && blog.core.util.searcher();
	}, true, false, variety, filters);
});