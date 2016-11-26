from cantools.web import respond, succeed, fail, cgi_get
from model import db, Comment

def response():
	action = cgi_get("action", choices=["post", "videopost", "comment"])
	user = cgi_get("user")
	if action.endswith("post"):
		blurb = cgi_get("blurb", required=False)
		pkey = cgi_get("key", required=False)
		pmod = db.get_model(action)
		if pkey:
			ent = pmod.query(pmod.key == pkey).get()
			ent.title = cgi_get("title")
			ent.blurb = cgi_get("blurb")
			ent.live = cgi_get("live")
			if blurb:
				ent.blurb = blurb
			if action != "videopost":
				ent.body = cgi_get("body")
		else:
			ent = pmod(user=user, title=cgi_get("title"), live=cgi_get("live"))
			if blurb:
				ent.blurb = blurb
			if action != "videopost":
				ent.body = cgi_get("body")
	elif action == "comment":
		ent = Comment(user=user, post=cgi_get("post"), body=cgi_get("body"))
	ent.put()
	succeed(ent.id())

respond(response)