import os
from cantools.web import respond, cgi_get, succeed
from cantools.util import log, mkdir, segment
from model import db

def response():
	v = db.get(cgi_get("v"))
	orig = v.video.urlsafe()[1:]
	p = orig.replace("blob/", "blob/hls/")
	isd = os.path.isdir(p)
	if cgi_get("check", default=False):
		succeed(isd)
	log("transcode > attempt with video: '%s'"%(v.title,), important=True)
	if not isd:
		mkdir(p, True)
		segment(orig, p)
		log("transcode > done!")

respond(response, threaded=True)