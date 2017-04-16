from cantools.web import respond, succeed, fail, cgi_get
from model import db, Comment, Photo

def response():
	action = cgi_get("action", choices=["post", "videopost", "comment", "photo", "photoset"])
	user = cgi_get("user")
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
		pmod = db.get_model(action)
		if pkey:
			ent = pmod.query(pmod.key == pkey).get()
		else:
			ent = pmod(user=user)
		ent.title = cgi_get("title")
		ent.live = cgi_get("live")
		if blurb:
			ent.blurb = blurb
		if action == "post":
			ent.body = cgi_get("body")
	ent.put()
	if action == "photo": # get photoset
		psk = cgi_get("photoset", required=False)
		if psk:
			ps = db.get(psk)
			if cgi_get("remove", default=False):
				ps.photos.remove(ent.key)
			else:
				ps.photos.append(ent.key)
			ps.put()
	succeed(ent.id())

respond(response)