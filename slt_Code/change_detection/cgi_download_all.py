#!/usr/bin/python
# -*- coding:utf-8 -*-
from write_all import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data():
    res 	= 'DONE'
    try:
        obj = ChangeDetection()
        res = obj.processAllDocuments()
    except Exception , args:
        res = str(args)
    return str(res) 
       

if __name__=="__main__":
   tmp = display_data()
   print tmp
