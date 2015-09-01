#!/usr/bin/python
# -*- coding:utf-8 -*-
from pre_doc_send_mail import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data(form):
    res 	= 'DONE'
    s = form.getfirst('input_str')
    if s:
        jsonObj  = ast.literal_eval(s)
        doc_lst = jsonObj.get('doc_list', '')
        email_lst = jsonObj.get('email_list', '')
        try:
           obj = ChangeDetection()
           res = obj.processAllDocuments(doc_lst,email_lst)
        except Exception , args:
           res = str(args)
    return str(res) 
       

if __name__=="__main__":
   form = cgi.FieldStorage()
   tmp = display_data(form)
   print tmp
