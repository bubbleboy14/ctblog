from cantools.web import respond, succeed, fail, cgi_get
from model import Post, Comment

def response():
	action = cgi_get("action", choices=["post", "comment"])
	user = cgi_get("user")
	if action == "post":
		pkey = cgi_get("key", required=False)
		if pkey:
			ent = Post.query(Post.key == pkey).get()
			ent.title = cgi_get("title")
			ent.blurb = cgi_get("blurb")
			ent.body = cgi_get("body")
			ent.live = cgi_get("live")
		else:
			ent = Post(user=user, title=cgi_get("title"), blurb=cgi_get("blurb"),
				body=cgi_get("body"), live=cgi_get("live"))
	elif action == "comment":
		ent = Comment(user=user, post=cgi_get("post"), body=cgi_get("body"))
	ent.put()
	succeed(ent.id())

respond(response)