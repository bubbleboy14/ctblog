from cantools import db

class Post(db.TimeStampedBase):
	user = db.ForeignKey(kind="ctuser")
	live = db.Boolean(default=False)
	title = db.String()
	blurb = db.String()
	body = db.Text()
	img = db.Binary()

class Comment(db.TimeStampedBase):
	user = db.ForeignKey(kind="ctuser")
	post = db.ForeignKey(kind="post")
	body = db.Text()