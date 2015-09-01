#!/usr/bin/python
import sys, os
import datetime
import time
import MySQLdb
import json


class ChangeDetection:
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
 
    def getActiveUsers_IDs(self, cursor):
        userLst = []
        try:
           selStmt = "select user_id from user_master where active_flag='Y'"
           cursor.execute(selStmt)
           res = cursor.fetchall()
           for valTup in res:
               userLst.append(str(valTup[0]))
        except Exception, args:
           print 'Exception in getActiveUsers', args

        return userLst

    def processAllDocuments(self):
       cursor, conn = self.connection()
       #stmt = 'select id,external_link_address from url_master order by id desc'
       stmt = 'select id,external_link_address from combined_california_general_business_law order by id asc'
       #stmt = 'select id,external_link_address from corporate_counsel order by id asc'
       cursor.execute(stmt)
       now = datetime.datetime.now()
       timeobj = now.strftime("%H_%M_%S")
       dateobj = now.strftime("%Y_%m_%d")
       date_dir = dateobj + '_' + timeobj
       docIdLst = cursor.fetchall()
       doc_lst = []
       for doc in docIdLst:
           doc_lst.append((int(doc[0]), doc[1]))
           
       conn.close()
       outDict = {'date_dir':date_dir,'data':doc_lst}
       ret = json.dumps(outDict)
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
