#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys, os
import MySQLdb
import json
class CaptureDoc:
    def __init__(self):
        import ConfigParser
        self.config = ConfigParser.ConfigParser()
        self.config.read('../dbConfig.ini')
        pass
    def readDB(self):
        data = self.config.get('database','value')
        khost, kpasswd, kuser, kdb = data.split('##')
        return khost, kpasswd, kuser, kdb


    def connection(self):
        vhost, vpasswd, vuser, vdbname = self.readDB()
        conn = MySQLdb.connect(host=vhost, user=vuser, passwd=vpasswd, db=vdbname)
        cursor = conn.cursor()
        return cursor, conn

    def captureDoc(self, response, url_id, datetime, newurl, table_name):
        cursor, conn = self.connection()
	if response == 'Redirect (other)':
        	stmt = "update %s set response_category = '%s',response = '%s', ping_date_time = '%s', redirect_url = '%s' where id = '%s'" %(table_name,response,response,datetime,newurl,url_id)
	else:
		stmt = "update %s set response_category = '%s',response = '%s', ping_date_time = '%s',redirect_url = '%s' where id = '%s'" %(table_name,response,response,datetime,'',url_id)
        cursor.execute(stmt)
	conn.commit()
        conn.close()
        return 'Done'  

if __name__ =='__main__':
       obj = CaptureDoc()
       tmp = obj.captureDoc('Success',540,'7-5-2015:17:6:5')
       print tmp
