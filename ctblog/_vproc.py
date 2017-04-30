from cantools.web import respond, cgi_get, succeed
from cantools.util import hlsify, transcode
from model import db

def response():
	action = cgi_get("action")
	vpath = db.get(cgi_get("v")).video.urlsafe()[1:]
	if action == "hls":
		succeed(hlsify(vpath, check=cgi_get("check", default=False)))
	elif action == "mp4":
		transcode(vpath, fast=False)

respond(response, threaded=True)