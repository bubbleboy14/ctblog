# ctblog
This package contains a generic blog-type website.


# Back (Init Config)

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
    	"/_blog": "_blog.py",
    	"/_vproc": "_vproc.py"
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
    	"about": {
    		"slider": [],
    		"blurb": "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem"
    	},
    	"post": {
    		"name": "Post",
    		"mode": "text",
    		"poster": null,
    		"blurb": true,
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
    	},
    	"media": {
    		"hls": false
    	},
    	"slider_class": "abs bottom0 w1 h120p"
    }