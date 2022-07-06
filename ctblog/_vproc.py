from cantools.web import respond, cgi_get, succeed
from cantools.util import hlsify, transcode
from model import db

def response():
	action = cgi_get("action")
	vpath = cgi_get("vpath", required=False)
	if not vpath:
		vid = db.get(cgi_get("v")).video
		if not vid: # no vid to process
			succeed()
		vpath = vid.urlsafe()
	elif ".." in vpath or not vpath.startswith("/v/"): # TODO: configurize ranvid path
		succeed() # invalid ranvid path
	vpath = vpath[1:]
	if action == "hls":
		succeed(hlsify(vpath, check=cgi_get("check", default=False)))
	elif action == "mp4":
		transcode(vpath)

respond(response, threaded=True)