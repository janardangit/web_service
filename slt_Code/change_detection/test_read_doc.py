#!/usr/bin/python
import cgitb
cgitb.enable()
import sys
import zipfile, re
print "Content-Type:text/html\n\n"

def read_doc():
    docx = zipfile.ZipFile('../test.docx')
    content = docx.read('word/document.xml')
    cleaned = re.sub('<(.)*?>','',content)
    print ">>>>>>>>>>>>>>>>>>> : ",type(cleaned)
    return cleaned
    #return content

if __name__ == '__main__':
    tmp = read_doc()
    print tmp
