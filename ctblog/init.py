copies = {
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
	"/_blog": "_blog.py"
}
requires = ["ctuser"]