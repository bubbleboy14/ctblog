from datetime import datetime, timedelta
from cantools.web import respond
from cantools.util import log, hlsify
from cantools import config
from model import *

def response():
	log("initiating cronscan", important=True)
	if config.autoexpire: # in days
		log("checking for expired VideoPosts", 1)
		n = datetime.now()
		cutoff = n - timedelta(config.autoexpire)
		expired = VideoPost.query(VideoPost.modified < cutoff).all()
		log("deactivating %s expired VideoPosts"%(len(expired),), 2)
		for vp in expired:
			vp.live = False
		db.put_multi(expired)
	if config.autohls:
		vz = VideoPost.query().all()
		log("scanning %s VideoPosts for missing hls files"%(len(vz),), 1)
		for v in vz:
			hlsify(v.video.urlsafe()[1:])
	log("cronscan complete")

respond(response)