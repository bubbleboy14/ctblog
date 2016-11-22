from cantools import db

class BasePost(db.TimeStampedBase):
	user = db.ForeignKey(kind="ctuser")
	live = db.Boolean(default=False)
	title = db.String()
	blurb = db.String()

class Post(BasePost):
	img = db.Binary()	
	body = db.Text()

class VideoPost(BasePost):
	video = db.Binary()

class Comment(db.TimeStampedBase):
	user = db.ForeignKey(kind="ctuser")
	post = db.ForeignKey(kinds=["post", "videopost"])
	body = db.Text()