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
 
    def processAllDocuments(self,table_name):
       sheet_name_arr = {'banking_finance':'B&F','business_law':'Business Law','california_business_entity_selection_formation':'CA Bus Entity','combined_california_general_business_law':'Combined Bus Entity Selection','commercial_bankrtupcy':'Bankruptcy','corporate_counsel':'Corp Counsel','intellectual_property':'IP','labor_employment':'L&E','m_a':'M&A','ny_business_commercial':'NY B&C','real_estate':'Real Estate','securities_capital_markets':'S&CM','texas_business_commercial':'Texas B&C','LN_UK_Practice_Area':'LN UK Practice Area'}
       workbook = xlsxwriter.Workbook('/var/www/html/Lexis_Link_Monitoring/output/'+table_name+'.xlsx')
       #workbook = xlsxwriter.Workbook(table_name+'.xlsx')
       worksheet = workbook.add_worksheet(sheet_name_arr[table_name])
       worksheet.set_column(1, 1, 30)
       worksheet.set_column(2, 2, 30)
       worksheet.set_column(3, 3, 30)
       worksheet.set_column(4, 4, 20)
       worksheet.set_column(5, 5, 30)
       worksheet.set_column(6, 6, 80)
       cursor, conn = self.connection()
       stmt = 'select excel_id,title,external_link_address,practice_area,content_type,location,update_date,page_type,response_category,ping_date_time,redirect_url from %s order by id asc' %(table_name)
       cursor.execute(stmt)
       docIdLst = cursor.fetchall()
       doc_lst = []
       header_lst = ['Id','Title','Address','Practice Area','Content Type','Location','Update Date','Page Type','Response Category','Ping Date Time','New URL (Redirect - Other only)']
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
       format2 = workbook.add_format() 
       format2.set_bottom_color('')
       format2.set_top_color('')
       format2.set_left_color('')
       format2.set_right_color('')
       for doc in docIdLst:
           col = 0
           for i in range(11):
               value = ch_obj.convert(str(doc[i]))
               worksheet.write_string(row, col,value,format2)  
               col += 1
           row += 1
       workbook.close() 
       conn.close()
       #outDict = {'data':doc_lst}
       ret = 'Lexis_Link_Monitoring/output/'+table_name+'.xlsx'
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
