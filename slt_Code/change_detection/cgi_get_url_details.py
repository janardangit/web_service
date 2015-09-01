#!/usr/bin/python
# -*- coding:utf-8 -*-
from get_url_details import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data(form):
    res 	= 'DONE'
    try:
       obj = ChangeDetection()
       res = obj.processAllDocuments()
    except Exception , args:
       res = str(args)

    return str(res) 
       

if __name__=="__main__":
   form = cgi.FieldStorage()
   tmp = display_data(form)
   print tmp
