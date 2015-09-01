#!/usr/bin/python
import sys, os
import datetime
import time
import MySQLdb
import json
import math 
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
       workbook = xlsxwriter.Workbook('/var/www/html/Lexis_Link_Monitoring/output/report.xlsx')
       #workbook = xlsxwriter.Workbook(table_name+'.xlsx')
       worksheet = workbook.add_worksheet()
       worksheet.set_column(1, 1, 30)
       worksheet.set_column(2, 2, 10)
       worksheet.set_column(3, 3, 10)
       worksheet.set_column(4, 4, 10)
       worksheet.set_column(5, 5, 10)
       worksheet.set_column(6, 6, 10)
       worksheet.set_column(7, 7, 10)
       worksheet.set_column(8, 8, 10)
       worksheet.set_column(9, 9, 10)
       worksheet.set_column(10, 10, 10)
       worksheet.set_column(11, 11, 10)
       worksheet.set_column(12, 12, 10)
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
           doc_lst.append((i,ind_table,main_count,success_count,fail_count,redirect_count,0,redirect_login_lexis_count,str(int(math.ceil(success_per)))+'%',str(int(math.ceil(fail_per)))+'%',str(int(math.ceil(redirect_per)))+'%','0%',str(int(math.ceil(login_lexis_per)))+'%'))
           i += 1
       conn.close()

       header_lst = ['Sl. No','Practice Area','No. of links','Success','Fail','Redirect (other)','Redirect (login)','Login (Lexis)','Success %','Fail %','Redirect (other) %','Redirect (login) %','Login (Lexis) %']
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
       for ind_doc in doc_lst:
           col = 0
           for i in range(13):
               value = ind_doc[i]
               worksheet.write(row, col,value)  
               col += 1
           row += 1
       merge_format = workbook.add_format({
           'bold':     True,
           'align':    'center',
           'valign':   'vcenter',
           'fg_color': '#D7E4BC',
       })

       worksheet.merge_range('A17:O17', '6 week trend as of 18-May-2015', merge_format)
       merge_format2 = workbook.add_format({
           'bold':     True,
           'align':    'center',
           'valign':   'vcenter',
           'fg_color': '#D7E4BC',
       })

       worksheet.merge_range('C19:H19', 'Number of Links', merge_format2)
       merge_format3 = workbook.add_format({
           'bold':     True,
           'border':   6,
           'align':    'center',
           'valign':   'vcenter',
           'fg_color': '#D7E4BC',
       })

       worksheet.merge_range('J19:O19', 'Failed Link % (shaded red if > 2.0%)', merge_format3)
       header_lst2 = ['Sl. No','Practice Area','18-may-15','25-may-15','1-june-15','8-june-15','15-june-15','22-june-15','','18-may-15','25-may-15','1-june-15','8-june-15','15-june-15','22-june-15']
       row = 19 
       col = 0
       ch_obj = html_entity_to_single_char.html_entity_to_single_char()
       format = workbook.add_format()
       format.set_bg_color('#4e9bfa')
       format.set_bold()
       for header2 in header_lst2:
           worksheet.write(row, col,header2,format)
           col += 1
       row += 1
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
                   ind_doc_lst[int(pos)+7] = int(math.ceil(fail_per))
               pos += 1
           doc_lst.append(ind_doc_lst)
           i += 1

       conn.close()
       format3 = workbook.add_format()
       format3.set_bg_color('red')
       for ind_doc in doc_lst:
           col = 0
           for i in range(15):
	       if i < 9:
                   value = ind_doc[i]
                   worksheet.write(row, col,value)
               else:
		   if str(ind_doc[i]):
		       value = str(ind_doc[i])+'%'
                       if ind_doc[i]< 3:                    
                           worksheet.write(row, col,value)
                       else:
                           worksheet.write(row, col,value,format3)
                   else:
                       value = str(ind_doc[i])
                       worksheet.write(row, col,value)
               col += 1
           row += 1
 
       workbook.close() 
       ret = 'Lexis_Link_Monitoring/output/report.xlsx'
       return ret


if __name__ =='__main__':
       obj = ChangeDetection()
       print obj.processAllDocuments()
