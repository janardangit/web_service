#!/usr/bin/python
# -*- coding:utf-8 -*-
from read_mail import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data():
    res 	= 'DONE'
    try:
        obj = ReadMail()
        res = obj.processMail()
    except Exception , args:
        res = str(args)
    return res 
       

if __name__=="__main__":
   tmp = display_data()
   print tmp
