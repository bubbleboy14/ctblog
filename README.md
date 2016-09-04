# ctblog
This package contains a generic blog-type website.


# Back (Init Config)

copies = {
	"html": ["index.html"],
	"css": ["custom.css"]
}
syms = {
	".": ["_blog.py"],
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

# Front (JS Config)

## core.config.ctblog
### Import line: 'CT.require("core.config");'
{
	"index": {
		"slider": [],
		"blurb": "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem"
	},
	"post": {
		"name": "Post",
		"blurs": {
			"title": ["Title"],
			"blurb": ["Blurb"],
			"body": ["Body"]
		}
	},
	"blog": {
		"blurs": {
			"comment": ["Comment"]
		}
	}
}