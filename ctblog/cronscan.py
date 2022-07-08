import os
from datetime import datetime, timedelta
from cantools.web import respond
from cantools.util import log, output, transcode, shouldMoveMoov, hlsify
from cantools import config
from model import *

class Moover(object):
	def __init__(self):
		self.checked = set()

	def check(self, fname):
		fpath = "v/%s"%(fname,)
		shouldMoveMoov(fpath) and transcode(fpath)
		self.checked.add(fname)

	def __call__(self):
		for dn, dz, fz in os.walk("v"):
			log("Moover scanning %s video files (%s already checked)"%(len(fz), len(self.checked)))
			for f in fz:
				if f not in self.checked:
					self.check(f)
			return

moover = Moover()

def response():
	log("initiating cronscan", important=True)
	if config.autoexpire: # in days
		log("checking for expired VideoPosts", 1)
		n = datetime.now()
		cutoff = n - timedelta(int(config.autoexpire))
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
	if config.moov:
		moover()
	log("cronscan complete")

respond(response)