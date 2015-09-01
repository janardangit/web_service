#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys, os
import MySQLdb
import json,ast



class CaptureDoc:
    def __init__(self):
        import ConfigParser
        self.config = ConfigParser.ConfigParser()
        self.config.read('../dbConfig_new.ini')
        pass
    def readDB(self):
        data = self.config.get('database','value')
        #data = 'localhost##tas123##root##Lexis_Link_Monitoring_New'
        khost, kpasswd, kuser, kdb = data.split('##')
        return khost, kpasswd, kuser, kdb


    def connection(self):
        vhost, vpasswd, vuser, vdbname = self.readDB()
        conn = MySQLdb.connect(host=vhost, user=vuser, passwd=vpasswd, db=vdbname)
        cursor = conn.cursor()
        return cursor, conn

    def captureDoc(self,doc_id):
        cursor, conn = self.connection()
        stmt = 'insert into rendered_doc_master(doc_id) values(%s)' %(doc_id)
        cursor.execute(stmt)
        conn.close()
        return 'Done'  

if __name__ =='__main__':
       obj = CaptureDoc()
       form = cgi.FieldStorage()
       if (form.has_key("input_str")):
          s = form.getfirst('input_str')
          jsonObj  = ast.literal_eval(s)
          doc_id = jsonObj.get('doc_id', '')
          tmp = obj.captureDoc(doc_id)
          print tmp
       else:
          tmp = obj.captureDoc(5423)
          print tmp
