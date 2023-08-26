import os, random
from cantools.web import respond, succeed, fail, cgi_get, read_file, clearmem
from cantools.util import log, write, token, shouldMoveMoov, transcode, thumb, dlp
from cantools.db import edit
from cantools import config
from model import db, Comment, Photo, Vid, Tag

def flist(path, ext, rando=False):
	fl = list(filter(lambda i : i.endswith(ext), os.listdir(path)))
	return rando and random.choices(fl, k=cgi_get("count", default=20)) or fl

def vchan():
	channel = cgi_get("channel", required=False, shield=True)
	return channel and "v/%s"%(channel,) or "v"

def response():
	if config.memcache.db:
		clearmem()
	action = cgi_get("action", choices=["post", "videopost", "comment", "photo", "photoset", "md", "ranvid", "imgz", "rm", "vz", "tz", "v"])
	if action == "tz":
		tname = cgi_get("name")
		if Tag.query(Tag.name == tname).get():
			fail("that tag exists")
		t = Tag()
		t.name = tname
		t.put()
		succeed(t.data())
	if action == "vz":
		vinfo = cgi_get("vinfo", required=False)
		succeed(vinfo and edit(vinfo).data() or {
			"all": flist(vchan(), ".mp4"),
			"tagged": [v.data() for v in Vid.query().all()]
		})
	if action == "v":
		fpath = os.path.join("v", "%s.mp4"%(token(10),))
		fname = cgi_get("data", required=False)
		if fname:
			write(read_file(fname), fpath, binary=True)
		else:
			dlp(cgi_get("url"), fpath)
		shouldMoveMoov(fpath) and transcode(fpath)
		thumb(fpath, dest="img", forceDest=True)
		succeed("/%s"%(fpath,))
	if action == "imgz":
		succeed(flist(os.path.join("img", "z"), ".jpg", True))
	if action == "ranvid":
		p = vchan()
		for dn, dz, fz in os.walk(p):
			vpath = "/%s/%s"%(p, random.choice(fz))
			log("ranvid: %s"%(vpath,))
			succeed(vpath)
	if action == "md":
		for dn, dz, fz in os.walk("md"):
			succeed([f[:-3] for f in fz])
	user = cgi_get("user")
	if action == "rm":
		item = db.get(cgi_get("key"))
		if item.polytype not in ["post", "videopost", "photoset"]:
			fail()
		if item.user.urlsafe() != user:
			fail()
		item.rm()
		succeed()
	if action == "comment":
		ent = Comment(user=user, post=cgi_get("post"), body=cgi_get("body"))
	elif action == "photo":
		pkey = cgi_get("key", required=False)
		if pkey:
			ent = Photo.query(Photo.key == pkey).get()
		else:
			ent = Photo()
		capt = cgi_get("caption", required=False) # imgs uploaded separately
		if capt:
			ent.caption = capt
	else:
		blurb = cgi_get("blurb", required=False)
		pkey = cgi_get("key", required=False)
		tags = cgi_get("tags", required=False)
		pmod = db.get_model(action)
		if pkey:
			ent = pmod.query(pmod.key == pkey).get()
		else:
			ent = pmod(user=user)
		ent.title = cgi_get("title")
		ent.live = cgi_get("live")
		ent.commentary = cgi_get("commentary", default=False)
		if blurb:
			ent.blurb = blurb
		if tags:
			ent.tags = tags
		if action == "post":
			ent.body = cgi_get("body")
		ent.beforeedit(force=True)
	ent.put()
	if action == "photo": # get photoset
		psk = cgi_get("photoset", required=False)
		if psk:
			ps = db.get(psk) # these are hacky -- fix list ops in ct
			if cgi_get("remove", default=False):
#				ps.photos.remove(ent.key)
				ps.photos = [p for p in ps.photos if p != ent.key]
			else:
#				ps.photos.append(ent.key)
				ps.photos = ps.photos + [ent.key]
			ps.put()
	succeed(ent.id())

respond(response)