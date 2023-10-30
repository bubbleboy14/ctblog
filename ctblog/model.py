from cantools import db
from ctuser.model import CTUser, Tag
from cantools import config

def thumb(path, ext=None):
	wcfg = config.web
	if not path:
		return
	if ext:
		path = "%s.%s"%(path, ext)
	return "%s://%s%s"%(wcfg.proto or "http", wcfg.domain, path)

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

	def thumbnail(self):
		return thumb(self.img.urlsafe())

class VideoPost(BasePost): # rename this, simplify code, migrate old dbs?
	video = db.Binary()
	poster = db.Binary()

	def thumbnail(self):
		return thumb(self.poster.urlsafe())

class Photo(db.TimeStampedBase):
	img = db.Binary()
	caption = db.String()
	label = "caption"

class PhotoSet(BasePost):
	photos = db.ForeignKey(repeated=True, kind=Photo)

	def thumbnail(self):
		return thumb(self.photos[0].get().img.urlsafe())

class Comment(db.TimeStampedBase):
	user = db.ForeignKey() # CTUser, Author, or whatever else
	post = db.ForeignKey(kinds=["post", "videopost", "photoset", "vid"])
	body = db.Text()

class Vid(db.TimeStampedBase):
	owner = db.ForeignKey() # CTUser, Author, or whatever else
	filename = db.String()
	name = db.String()
	blurb = db.Text()
	tags = db.ForeignKey(kind=Tag, repeated=True)

	def thumbnail(self):
		return thumb(self.filename, ext="jpg")

	def comments(self):
		return Comment.query(Comment.post == self.key).all()

	def beforeremove(self, session):
		db.delete_multi(self.comments(), session)
