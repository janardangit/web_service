#!/usr/bin/python
# -*- coding:utf-8 -*-
from send_mail import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data():
    res 	= 'DONE'
    try:
        obj = SendMail()
        res = obj.processMail()
    except Exception , args:
        res = str(args)
    return str(res) 
       

if __name__=="__main__":
   tmp = display_data()
   print tmp
