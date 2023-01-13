import os, random
from cantools.web import respond, succeed, fail, cgi_get, clearmem
from cantools.util import log
from cantools import config
from model import db, Comment, Photo

def response():
	if config.memcache.db:
		clearmem()
	action = cgi_get("action", choices=["post", "videopost", "comment", "photo", "photoset", "md", "ranvid", "imgz", "rm"])
	if action == "imgz":
		succeed(random.choices(list(filter(lambda i : i.endswith(".jpg"),
			os.listdir(os.path.join("img", "z")))), k=cgi_get("count", default=20)))
	if action == "ranvid":
		channel = cgi_get("channel", required=False, shield=True)
		p = channel and "v/%s"%(channel,) or "v"
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
		ent.commentary = cgi_get("commentary", default=True)
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