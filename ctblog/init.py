dirs = ["md"]
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
	"/md": "md",
	"/_blog": "_blog.py",
	"/_vproc": "_vproc.py"
}
requires = ["ctuser"]
