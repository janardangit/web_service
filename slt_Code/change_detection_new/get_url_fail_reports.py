#!/usr/bin/python
import os
import datetime
import time
import MySQLdb
import json
import math


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


    def get_week_nos(self,table_name):
        cursor, conn = self.connection()
        stmt1 = 'select week_no from %s group by week_no' %(table_name)
        cursor.execute(stmt1)
        weekLst = cursor.fetchall()
        #print weekLst
	last_week_no = []
        for week in weekLst:
            last_week_no.append(week[0])
        if (last_week_no[0] != 2):
            last_week_no = [2] + last_week_no
        return last_week_no

    def processAllDocuments(self):
       cursor, conn = self.connection()
       table_lst = ['banking_finance','business_law','california_business_entity_selection_formation','combined_california_general_business_law','commercial_bankrtupcy','corporate_counsel','intellectual_property','labor_employment','m_a','ny_business_commercial','real_estate','securities_capital_markets','texas_business_commercial']
       doc_lst = []
       i = 1
       for ind_table in table_lst:
           week_no_lst = self.get_week_nos(ind_table)
	   ind_doc_lst = [i,ind_table,'','','','','','','','','','','','','']
	   pos = 2
       	   for j in week_no_lst:
               stmt1 = 'select count(*) from %s where week_no = %s' %(ind_table,j)
               stmt2 = 'select count(*) from %s where response_category like "Fail" and week_no = %s' %(ind_table,j)
               cursor.execute(stmt1)
               docIdLst = cursor.fetchall()
               for doc in docIdLst:
	           main_count = int(doc[0])
	       cursor.execute(stmt2)
               docIdLst = cursor.fetchall()
               for doc in docIdLst:
                   fail_count = int(doc[0])
               fail_per = 0
               if main_count:
	           fail_per = float(fail_count)/main_count * 100
	       ind_doc_lst[pos] = main_count
	       ind_doc_lst[int(pos)+7] = int(math.ceil(fail_per))
	       pos += 1
           doc_lst.append(ind_doc_lst)
           i += 1
           
       conn.close()
       outDict = {'data':doc_lst}
       ret = json.dumps(outDict)
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
