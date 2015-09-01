#!/usr/bin/python
# -*- coding:utf-8 -*-
from process_export_xlsx_db_new import *
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"


def display_data():
    res 	= 'DONE'
    try:
       obj = ExportData()
       res = obj.csv_from_excel()
    except Exception , args:
       res = str(args)

    return str(res) 
       

if __name__=="__main__":
   tmp = display_data()
   print tmp
