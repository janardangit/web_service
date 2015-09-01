#!/usr/bin/python
# -*- coding:utf-8 -*-
from write_xls_new import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data(form):
    res 	= 'DONE'
    s = form.getfirst('input_str')
    if s:
        jsonObj  = ast.literal_eval(s)
        table_name = jsonObj.get('table_name', '')
        try:
           obj = ChangeDetection()
           res = obj.processAllDocuments(table_name)
        except Exception , args:
           res = str(args)
    return str(res) 
       

if __name__=="__main__":
   form = cgi.FieldStorage()
   tmp = display_data(form)
   print tmp
