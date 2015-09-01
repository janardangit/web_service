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

    def captureDoc(self, response, url_id, datetime, newurl):
        cursor, conn = self.connection()
	if response == 'Redirect (other)':
        	stmt = "update combined_california_general_business_law set response_category = '%s',response = '%s', ping_date_time = '%s', redirect_url = '%s' where id = '%s'" %(response,response,datetime,newurl,url_id)
	else:
		stmt = "update combined_california_general_business_law set response_category = '%s',response = '%s', ping_date_time = '%s',redirect_url = '%s' where id = '%s'" %(response,response,datetime,'',url_id)
        cursor.execute(stmt)
	conn.commit()
        conn.close()
        return 'Done'  

if __name__ =='__main__':
       obj = CaptureDoc()
       tmp = obj.captureDoc('Success',540,'7-5-2015:17:6:5','http://www.google.com')
       print tmp
