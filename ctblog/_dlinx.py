from cantools.web import respond, cgi_get, metize, text2image
from cantools.util import read
from model import db

def striplinx(s):
	while "](" in s:
		mid = s.index("](")
		start = s.index("[")
		end = s.index(")", mid)
		s = s[:start] + s[start + 1:mid] + s[end + 1:]
	return "%s..."%(s.strip(".,;:").replace('"', "'"),)

def mextract(p, markup):
	if p == "/blog/md.html":
		chap = cgi_get("c", required=False, decode=True)
		md = read("md/%s.md"%(cgi_get("n"),))
		pars = md.split("\n")
		metas = {}
		metas["name"] = pars.pop(0)
		if chap:
			chap = chap.replace("+", " ").strip()
			metas["name"] += " | %s"%(chap.replace('"', "'"),)
			line = pars.pop(0)
			while line != chap:
				line = pars.pop(0)
		pars.pop(0) # underline
		metas["blurb"] = striplinx(pars.pop(0) or pars.pop(0))
		metas["image"] = text2image(pars)
		print("\ndlinx metas:", metas, "\n\n")
		return metas
	if p == "/blog/vid.html":
		v = db.get(cgi_get("v", decode=True))
		return {
			"name": v.name,
			"blurb": v.blurb.strip(),
			"image": v.thumbnail()
		}

def response():
	metize(mextract)

respond(response)