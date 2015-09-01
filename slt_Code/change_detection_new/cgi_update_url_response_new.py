#!/usr/bin/python
# -*- coding:utf-8 -*-
from update_url_response_new import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data(form):
    res 	= ''
    s = form.getfirst('input_str')
    if s:
        jsonObj  = ast.literal_eval(s)
        response = jsonObj.get('response', '')
        url_id = jsonObj.get('url_id', '')
        datetime = jsonObj.get('datetime', '')
        newurl = jsonObj.get('new_url', '')
        table_name = jsonObj.get('table_name', '')
        try:
           obj = CaptureDoc()
           res = obj.captureDoc(response,url_id,datetime, newurl,table_name)
        except Exception , args:
           res = str(args)
    return str(res) 
       

if __name__=="__main__":
   form = cgi.FieldStorage()
   tmp = display_data(form)
   print tmp
