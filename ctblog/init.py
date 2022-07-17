dirs = ["md", "v"]
copies = {
	".": ["cronscan.py"],
	"html": ["index.html"],
	"css": ["custom.css"]
}
syms = {
	".": ["_blog.py", "_vproc.py"],
	"js": ["blog"],
	"css": ["blog.css"],
	"html": ["blog"]
}
model = {
	"ctblog.model": ["*"]
}
routes = {
	"/v": "v",
	"/md": "md",
	"/_blog": "_blog.py",
	"/_vproc": "_vproc.py"
}
cfg = {
	"video": {
		"autoexpire": False,
		"autohls": False,
		"moov": {
			"transcode": False,
			"initchecked": False
		}
	}
}
requires = ["ctuser"]
