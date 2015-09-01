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
        self.config.read('../dbConfig.ini')
	pass

    def processAllDocuments(self):
       table_lst = ['banking_finance','business_law','california_business_entity_selection_formation','combined_california_general_business_law','commercial_bankrtupcy','corporate_counsel','intellectual_property','labor_employment','m_a','ny_business_commercial','real_estate','securities_capital_markets','texas_business_commercial']
       doc_lst = []
       i = 1
       for ind_table in table_lst:
	   ind_doc_lst = [i,ind_table,'','','','','','','','','','','','','']
	   pos = 2
       	   for j in range(2,8):
	       if j < 8:
                   db_name = 'Lexis_Link_Monitoring_week%s' %(j)
                   conn = MySQLdb.connect(host='localhost', user='root', passwd='tas123', db=db_name) 
                   cursor = conn.cursor()
                   stmt1 = 'select count(*) from %s' %(ind_table)
                   stmt2 = 'select count(*) from %s where response_category like "Fail"' %(ind_table)
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
	           #ind_doc_lst[int(pos)+7] = int(math.ceil(fail_per))
	           ind_doc_lst[int(pos)+7] = int(math.floor(fail_per))
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
