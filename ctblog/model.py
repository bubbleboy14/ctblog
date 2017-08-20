from cantools import db

class BasePost(db.TimeStampedBase):
	user = db.ForeignKey(kind="ctuser")
	live = db.Boolean(default=False)
	title = db.String()
	blurb = db.String()
	tags = db.String(repeated=True)

class Post(BasePost):
	img = db.Binary()	
	body = db.Text()

class VideoPost(BasePost): # rename this, simplify code, migrate old dbs?
	video = db.Binary()
	poster = db.Binary()

class Photo(db.TimeStampedBase):
	img = db.Binary()
	caption = db.String()
	label = "caption"

class PhotoSet(BasePost):
	photos = db.ForeignKey(repeated=True, kind=Photo)

class Comment(db.TimeStampedBase):
	user = db.ForeignKey(kind="ctuser")
	post = db.ForeignKey(kinds=["post", "videopost", "photoset"])
	body = db.Text()