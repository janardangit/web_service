#!/usr/bin/python
import cgitb
cgitb.enable()
import sys
import zipfile, re

class read_doc:
	def read_doc(self):
	    docx = zipfile.ZipFile('../test.docx')
	    content = docx.read('word/document.xml')
	    content_ar =  re.findall(r'<w:t>.*?</w:t>', content)
	    for i, each in enumerate(content_ar):
		clean_content = re.sub('<.*?>', '', each).strip()
		if i < 8 or i >64:
		     print '\n---------------------', clean_content, '-----------------------\n'
		     continue
		if len(clean_content) == 2 and clean_content.isdigit():
		     print '\n'
		else:
		     print clean_content, ' ==== ', 
		continue
		if i == 0:
		    print clean_content
		    continue
		if (i+1%5) == 0:
		    print clean_content, '\n'
		else:
		    print clean_content,
	    #cleaned = re.sub('<(.)*?>','',content)
	    #print ">>>>>>>>>>>>>>>>>>> : ",type(cleaned)
	    #return cleaned

if __name__ == '__main__':
    #tmp = read_doc()
    obj = read_doc()
    tmp = obj.read_doc()
    #print tmp
