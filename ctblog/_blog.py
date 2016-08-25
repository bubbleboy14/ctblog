from cantools.web import respond, succeed, fail, cgi_get
from model import Post, Comment

def response():
	action = cgi_get("action", choices=["post", "comment"])
	user = cgi_get("user")
	if action == "post":
		ent = Post(user=user, title=cgi_get("title"),
			blurb=cgi_get("blurb"), body=cgi_get("body"))
	elif action == "comment":
		ent = Comment(user=user, post=cgi_get("post"), comment=cgi_get("body"))
	ent.put()
	succeed(ent.id())

respond(response)