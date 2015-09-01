"""ents.pty
Convert SGML character entities into Unicode

Function taken from:
http://stackoverflow.com/questions/1197981/convert-html-entities-to-ascii-in-python/1582036#1582036

Thanks agazso!
"""
import re
import htmlentitydefs


class html_entity_to_single_char:

	def convert(self, s):
	    """Take an input string s, find all things that look like SGML character
	    entities, and replace them with the Unicode equivalent.
	    Function is from:
	    http://stackoverflow.com/questions/1197981/convert-html-entities-to-ascii-in-python/1582036#1582036
	    """
	    matches = re.findall("&#\d+;", s)
	    if len(matches) > 0:
		hits = set(matches)
		for hit in hits:
		    name = hit[2:-1]
		    try:
			entnum = int(name)
			s = s.replace(hit, unichr(entnum))
		    except ValueError:
			pass
	    matches = re.findall("&\w+;", s)
	    hits = set(matches)
	    amp = "&"
	    if amp in hits:
		hits.remove(amp)
	    for hit in hits:
		name = hit[1:-1]
		if name in htmlentitydefs.name2codepoint:
		    s = s.replace(hit,
				  unichr(htmlentitydefs.name2codepoint[name]))
	    s = s.replace(amp, "&")
	    return s

if __name__=="__main__":
        obj = html_entity_to_single_char()

	mystr = "&#8220;Circuit Issues Split &#917;  Decisions on PTO Continuation Rules,&#8221; Banner &amp; Witcoff IP UPDATE" # utf-8
        mystr = "As a member of Bradford & Barthel&#8217;s Oakland office, Mr. Adil&#8217;s primary area of practice is workers&#8217; compensation defense. He appears at the Oakland, San Francisco and Stockton WCAB&#8217;s, in addition to ADR cases. Mr. Adil also does asbestos defense"
        mystr = "&quot;The Basics of Civil Litigation&#8212;How to Get Your Evidence In and Keep the Other Side's Out&quot;"  
	print mystr 
	print ' + ', len(mystr)
	convert_mystr = obj.convert(mystr)
	print convert_mystr 

