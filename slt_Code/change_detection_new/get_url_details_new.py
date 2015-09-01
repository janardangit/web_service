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

    def processAllDocuments(self,table_name,ids):
       last_week_no = self.latest_week_no(table_name)
       cursor, conn = self.connection()
       #stmt = 'select id,external_link_address from url_master order by id desc'
       #stmt = 'select id,external_link_address from m_a where id=406 order by id asc'
       if len(ids):
           id_value = ','.join(ids)
           stmt = 'select id,external_link_address from %s where id in(%s) and week_no = %s order by id asc' %(table_name,id_value,last_week_no)
       else:
           stmt = 'select id,external_link_address from %s where week_no = %s order by id asc' %(table_name,last_week_no)
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
