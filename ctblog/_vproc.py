from cantools.web import respond, cgi_get, succeed
from cantools.util import hlsify
from model import db

def response():
	succeed(hlsify(db.get(cgi_get("v")).video.urlsafe()[1:],
		check=cgi_get("check", default=False)))

respond(response, threaded=True)