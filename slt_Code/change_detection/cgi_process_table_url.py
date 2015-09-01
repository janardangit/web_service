#!/usr/bin/python
# -*- coding:utf-8 -*-
from urlrenderMain import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data(form):
    res 	= 'DONE'
    s = form.getfirst('input_str')
    if s:
        jsonObj  = ast.literal_eval(s)
        table_name = jsonObj.get('table_name', '')
        ids = jsonObj.get('ids', '')
        try:
           obj = URLRender()
           res = obj.url_render_new(table_name,ids)
        except Exception , args:
           res = str(args)
    return str(res) 
       

if __name__=="__main__":
   form = cgi.FieldStorage()
   tmp = display_data(form)
   print tmp
