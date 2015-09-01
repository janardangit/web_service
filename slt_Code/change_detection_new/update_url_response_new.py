#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys, os
import MySQLdb
import json
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

    def latest_week_no(self,table_name):
        cursor, conn = self.connection()
        stmt1 = 'select week_no from %s order by week_no desc limit 1' %(table_name)
        cursor.execute(stmt1)
        weekLst = cursor.fetchall()
        #print weekLst
        for week in weekLst:
            last_week_no = week[0]
            break
        return last_week_no

    def captureDoc(self, response, url_id, datetime, newurl, table_name):
        last_week_no = self.latest_week_no(table_name)
        cursor, conn = self.connection()
	if response == 'Redirect (other)':
        	stmt = "update %s set response_category = '%s',response = '%s', ping_date_time = '%s', redirect_url = '%s' where id = '%s' and week_no = %s" %(table_name,response,response,datetime,newurl,url_id,last_week_no)
	else:
		stmt = "update %s set response_category = '%s',response = '%s', ping_date_time = '%s',redirect_url = '%s' where id = '%s' and week_no = %s" %(table_name,response,response,datetime,'',url_id,last_week_no)
        cursor.execute(stmt)
	conn.commit()
        conn.close()
        return 'Done'  

if __name__ =='__main__':
       obj = CaptureDoc()
       tmp = obj.captureDoc('Success',540,'7-5-2015:17:6:5')
       print tmp
