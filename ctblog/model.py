from cantools import db
from ctuser.model import CTUser

class Author(CTUser):
	cc = db.JSON() # carecoin {person,membership}

class BasePost(db.TimeStampedBase):
	user = db.ForeignKey() # CTUser, Author, or whatever else
	live = db.Boolean(default=False)
	title = db.String()
	blurb = db.String()
	searcher = db.Text()
	tags = db.String(repeated=True)
	commentary = db.Boolean(default=True)

	def comments(self):
		return Comment.query(Comment.post == self.key).all()

	def beforeedit(self, edits={}, force=False):
		if force or "title" in edits or "blurb" in edits:
			self.searcher = "%s %s"%(edits.get("title", self.title), edits.get("blurb", self.blurb))

	def beforeremove(self, session):
		db.delete_multi(self.comments(), session)

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
	user = db.ForeignKey() # CTUser, Author, or whatever else
	post = db.ForeignKey(kinds=["post", "videopost", "photoset"])
	body = db.Text()