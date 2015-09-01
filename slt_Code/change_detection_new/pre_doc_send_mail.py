#!/usr/bin/python
import sys, os
import datetime
import time
import MySQLdb
import json
import xlsxwriter
import html_entity_to_single_char
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.mime.text import MIMEText
from email import Encoders
import datetime


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

    def prepare_doc_excel(self,doc_lst):
        workbook = xlsxwriter.Workbook('/var/www/html/Lexis_Link_Monitoring/output/result.xlsx')
        table_lst = doc_lst 
        sheet_name_arr = {'banking_finance':'B&F','business_law':'Business Law','california_business_entity_selection_formation':'CA Bus Entity','combined_california_general_business_law':'Combined Bus Entity Selection','commercial_bankrtupcy':'Bankruptcy','corporate_counsel':'Corp Counsel','intellectual_property':'IP','labor_employment':'L&E','m_a':'M&A','ny_business_commercial':'NY B&C','real_estate':'Real Estate','securities_capital_markets':'S&CM','texas_business_commercial':'Texas B&C'}
        for ind_table in table_lst:
            table_name = ind_table
            last_week_no = self.latest_week_no(table_name)
            #sheet_name = sheet_name_arr[j]
            worksheet = workbook.add_worksheet(sheet_name_arr[table_name])
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
        return True 

    def send_mail(self,email_lst):
        sheet_name_arr = {'banking_finance':'B&F','business_law':'Business Law','california_business_entity_selection_formation':'CA Bus Entity','combined_california_general_business_law':'Combined Bus Entity Selection','commercial_bankrtupcy':'Bankruptcy','corporate_counsel':'Corp Counsel','intellectual_property':'IP','labor_employment':'L&E','m_a':'M&A','ny_business_commercial':'NY B&C','real_estate':'Real Estate','securities_capital_markets':'S&CM','texas_business_commercial':'Texas B&C'}
        EMAIL_FROM = 'tas_url_monitor@tas.in'
        EMAIL_TO = email_lst
        EMAIL_CC = 'aref.rahman@tas.us.com'
        EMAIL_SERVER = 'smtp.tas.in'
        SUBJECT = "URL Monitoring results for "
        for ind_doc in doc_lst:
            SUBJECT += sheet_name_arr[ind_doc]+' '
        i = datetime.datetime.now()
        #date_str = "%s-%s-%s" % (i.day, i.month, i.year)
        date_str = str(i.strftime('%d-%m-%Y'))
        SUBJECT += 'as of '+date_str
	msg = MIMEMultipart()
	msg['Subject'] = SUBJECT 
	msg['From'] = EMAIL_FROM
	msg['To'] = ', '.join(EMAIL_TO) 
        #msg['cc'] = EMAIL_CC
	#files = ['result.xlsx','report.xlsx']
	files = ['result.xlsx']
	msgtxt = """<html><head></head><body><p>Hi,</p><p>Please find attached URL Monitoring results as of """+date_str+"""</p></br></br><p>Regards</p><p>TAS URL Monitoring Team</p></body></html>"""
	msg.attach( MIMEText(msgtxt,'html') )
	for file_name in files:
	    part = MIMEBase('application', "octet-stream")
	    part.set_payload(open("/var/www/html/Lexis_Link_Monitoring/output/"+file_name, "rb").read())
	    Encoders.encode_base64(part)
	    part.add_header('Content-Disposition', 'attachment; filename="'+file_name+'"')
	    msg.attach(part)

	server = smtplib.SMTP(EMAIL_SERVER,25)
	server.login('tas_url_monitor@tas.in','HphR#$a5')
	server.sendmail(EMAIL_FROM, EMAIL_TO, msg.as_string())
        server.quit()
	return 'Mail Sent'
    
 
    def processAllDocuments(self,doc_lst,email_lst):
        if self.prepare_doc_excel(doc_lst):   
            self.send_mail(email_lst)   
            return 'Done' 
        return "Error"

if __name__ =='__main__':
    obj = ChangeDetection()
    print obj.processAllDocuments()
