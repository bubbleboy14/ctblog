from cantools.web import respond, cgi_get, metize
from cantools.util import read

def striplinx(s):
	while "](" in s:
		mid = s.index("](")
		start = s.index("[")
		end = s.index(")", mid)
		s = s[:start] + s[start + 1:mid] + s[end + 1:]
	return "%s..."%(s.strip(".,;:"),)

def mextract(p, markup):
	if p == "/blog/md.html":
		chap = cgi_get("c", required=False, decode=True)
		md = read("md/%s.md"%(cgi_get("n"),))
		pars = md.split("\n")
		metas = {}
		metas["name"] = pars.pop(0)
		if chap:
			metas["name"] += " |%s"%(chap,)
			chap = chap.strip()
			line = pars.pop(0)
			while line != chap:
				line = pars.pop(0)
		pars.pop(0) # underline
		metas["blurb"] = striplinx(pars.pop(0) or pars.pop(0))
		for par in pars:
			if par.startswith("https://"):
				metas["image"] = par
				break
		print("\ndlinx metas:", metas, "\n\n")
		return metas

def response():
	metize(mextract)

respond(response)