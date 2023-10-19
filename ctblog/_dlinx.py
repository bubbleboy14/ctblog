from dez.http.static import StaticStore
from cantools.web import respond, local, cgi_get, send_file
from cantools.util import read
from cantools import config
from model import db

filestore = StaticStore()
qcache = {}
#<script type="application/ld+json">{"@context":"http://schema.org","@type":"Video","name":"","image":""}</script>
METS = """
  <meta property="og:title" content="%s">
  <meta property="twitter:title" content="%s">
  <meta property="og:image" content="%s">
  <meta property="twitter:image" content="%s">
  <meta property="og:description" content="%s">
  <meta property="twitter:description" content="%s">
  <meta property="description" content="%s">
"""

def metize(m):
	n = m["name"]
	i = m["image"]
	b = m["blurb"]
	return METS%(n, n, i, i, b, b, b)

def response():
	qs = local("request_string") # better key?
	p = local("response").request.url
#	print(p)
	mdir = config.mode == "dynamic" and "html" or "html-%s"%(config.mode,)
	fp = "%s%s"%(mdir, p)
#	print(fp)
	if p not in qcache:
		qcache[p] = {}
	if qs not in qcache[p]:
		metas = None
		markup = filestore.read(fp)[0].decode()
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
			metas["blurb"] = pars.pop(0) or pars.pop(0)
			for par in pars:
				if par.startswith("https://"):
					metas["image"] = par
					break
			print("\ndlinx metas:", metas, "\n\n")
		if metas:
			markup = markup.replace("<head>", "<head>%s"%(metize(metas),))
		qcache[p][qs] = markup
	send_file(qcache[p][qs])

respond(response)