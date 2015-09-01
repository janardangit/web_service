#!/usr/bin/python
import sys, os
import datetime
import time
import MySQLdb
import json
import math


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
       table_lst = ['banking_finance','business_law','california_business_entity_selection_formation','combined_california_general_business_law','commercial_bankrtupcy','corporate_counsel','intellectual_property','labor_employment','m_a','ny_business_commercial','real_estate','securities_capital_markets','texas_business_commercial']
       doc_lst = []
       i = 1
       for ind_table in table_lst:
           stmt1 = 'select count(*) from %s' %(ind_table)
           stmt2 = 'select count(*) from %s where response_category like "Success"' %(ind_table)
           stmt3 = 'select count(*) from %s where response_category like "Fail"' %(ind_table)
           stmt4 = 'select count(*) from %s where response_category like "Redirect (other)"' %(ind_table)
           stmt5 = 'select count(*) from %s where response_category like "Login (Lexis)"' %(ind_table)
           cursor.execute(stmt1)
           docIdLst = cursor.fetchall()
           for doc in docIdLst:
	       main_count = int(doc[0])
	   cursor.execute(stmt2)
           docIdLst = cursor.fetchall()
           for doc in docIdLst:
               success_count = int(doc[0])
           cursor.execute(stmt3)
           docIdLst = cursor.fetchall()
           for doc in docIdLst:
               fail_count = int(doc[0])
           cursor.execute(stmt4)
           docIdLst = cursor.fetchall()
           for doc in docIdLst:
               redirect_count = int(doc[0])
	   cursor.execute(stmt5)
           docIdLst = cursor.fetchall()
           for doc in docIdLst:
               redirect_login_lexis_count = int(doc[0])
	   success_per = float(success_count)/main_count * 100
	   fail_per = float(fail_count)/main_count * 100
	   redirect_per = float(redirect_count)/main_count * 100
	   login_lexis_per = float(redirect_login_lexis_count)/main_count * 100
           #doc_lst.append((i,ind_table,main_count,success_count,fail_count,redirect_count,0,redirect_login_lexis_count,math.ceil(success_per),math.ceil(fail_per),math.ceil(redirect_per),'0',math.ceil(login_lexis_per)))
           doc_lst.append((i,ind_table,main_count,success_count,fail_count,redirect_count,0,redirect_login_lexis_count,math.floor(success_per),math.floor(fail_per),math.floor(redirect_per),'0',math.floor(login_lexis_per)))
           i += 1
           
       conn.close()
       outDict = {'data':doc_lst}
       ret = json.dumps(outDict)
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
