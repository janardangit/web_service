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
 
    def processAllDocuments(self,table_name):
       last_week_no = self.latest_week_no(table_name)
       workbook = xlsxwriter.Workbook('/var/www/html/Lexis_Link_Monitoring/output/'+table_name+'.xlsx')
       #workbook = xlsxwriter.Workbook(table_name+'.xlsx')
       worksheet = workbook.add_worksheet()
       worksheet.set_column(1, 1, 30)
       worksheet.set_column(2, 2, 30)
       worksheet.set_column(3, 3, 30)
       worksheet.set_column(4, 4, 20)
       worksheet.set_column(5, 5, 30)
       worksheet.set_column(6, 6, 80)
       cursor, conn = self.connection()
       stmt = 'select id,external_link_label,topic_tree_location,external_link_address,response_category,ping_date_time,redirect_url from %s where week_no = %s order by id asc' %(table_name,last_week_no)
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
       #outDict = {'data':doc_lst}
       ret = 'Lexis_Link_Monitoring/output/'+table_name+'.xlsx'
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
