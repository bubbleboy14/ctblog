from cantools.web import respond, cgi_get, succeed
from cantools.util import hlsify, transcode
from model import db

def response():
	action = cgi_get("action")
	vid = db.get(cgi_get("v")).video
	if not vid: # no vid to process
		succeed()
	vpath = vid.urlsafe()[1:]
	if action == "hls":
		succeed(hlsify(vpath, check=cgi_get("check", default=False)))
	elif action == "mp4":
		transcode(vpath, slow=True)

respond(response, threaded=True)