#!/usr/bin/python
import sys, os
import datetime
import time
import MySQLdb
import json
import xlsxwriter
import html_entity_to_single_char

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
 
    def processAllDocuments(self):
       workbook = xlsxwriter.Workbook('/var/www/html/Lexis_Link_Monitoring/output/result.xlsx')
       table_lst = ['banking_finance','business_law','california_business_entity_selection_formation','combined_california_general_business_law','commercial_bankrtupcy','corporate_counsel','intellectual_property','labor_employment','m_a','ny_business_commercial','real_estate','securities_capital_markets','texas_business_commercial']
       sheet_name_arr = ['B&F','Business Law','CA Bus Entity','Combined Bus Entity Selection','Bankruptcy','Corp Counsel','IP','L&E','M&A','NY B&C','Real Estate','S&CM','Texas B&C']
       j = 0
       for ind_table in table_lst:
           table_name = ind_table
           sheet_name = sheet_name_arr[j]
           worksheet = workbook.add_worksheet(sheet_name)
           worksheet.set_column(1, 1, 30)
           worksheet.set_column(2, 2, 30)
           worksheet.set_column(3, 3, 30)
           worksheet.set_column(4, 4, 20)
           worksheet.set_column(5, 5, 30)
           worksheet.set_column(6, 6, 80)

           j += 1
           cursor, conn = self.connection()
           stmt = 'select id,external_link_label,topic_tree_location,external_link_address,response_category,ping_date_time,redirect_url from %s order by id asc' %(table_name)
           cursor.execute(stmt)
           docIdLst = cursor.fetchall()
           doc_lst = []
           header_lst = ['Sl. No','External Link Label','Topic Tree Location','External Link Address','Response Category','Ping Date Time','New URL (Redirect - Other only)']
           row = 0;
           col = 0;
           ch_obj = html_entity_to_single_char.html_entity_to_single_char()
           #bold = workbook.add_format({'bold': True})
           format = workbook.add_format()
           format.set_bg_color('#4e9bfa')
           format.set_bold()
           for header in header_lst:
               worksheet.write(row, col,header,format)
               col += 1
           row += 1
        
           for doc in docIdLst:
               col = 0
               for i in range(7):
                   value = ch_obj.convert(str(doc[i]))
                   worksheet.write_string(row, col,value)  
                   col += 1
               row += 1
       workbook.close() 
       conn.close()
       ret = 'Lexis_Link_Monitoring/output/result.xlsx'
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
