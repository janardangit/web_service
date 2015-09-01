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

    def processAllDocuments(self,table_name):
       cursor, conn = self.connection()
       stmt = 'select * from %s order by id asc' %(table_name)
       cursor.execute(stmt)
       docIdLst = cursor.fetchall()
       doc_lst = []
       for doc in docIdLst:
           doc_lst.append((doc[0],doc[1],doc[2],doc[3],doc[5],doc[6],doc[7]))
       conn.close()
       outDict = {'data':doc_lst}
       ret = json.dumps(outDict)
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
