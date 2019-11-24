# ctblog
This package contains a generic blog-type website.


# Back (Init Config)

    copies = {
    	".": ["cron.yaml", "cronscan.py"],
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
    		"latest": false,
    		"slider": [],
    		"blurb": "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem"
    	},
    	"about": {
    		"slider": [],
    		"blurb": "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem"
    	},
    	"post": {
    		"name": "Post",
    		"mode": "post",
    		"poster": null,
    		"blurb": true,
    		"tabbed": false,
    		"tags": [],
    		"taggerClass": "basicpopup mosthigh",
    		"blurs": {
    			"title": ["Title"],
    			"blurb": ["Blurb"],
    			"body": ["Body"]
    		}
    	},
    	"blog": {
    		"photoset_embed": false,
    		"blurs": {
    			"comment": ["Comment"]
    		}
    	},
    	"media": {
    		"hls": false,
    		"mp4": false
    	},
    	"slider_class": "abs bottom0 w1 h120p"
    }
    