#!/usr/bin/python
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.mime.text import MIMEText
from email import Encoders

class SendMail:
    def __init__(self):
	import ConfigParser
        self.config = ConfigParser.ConfigParser()
        self.config.read('../dbConfig.ini')
	self.EMAIL_FROM = ''
	self.EMAIL_TO = ''
        self.EMAIL_CC = ''
	self.EMAIL_SERVER = 'smtp.tas.in'
	pass

    def processMail(self):
	SUBJECT = "URL Monitor Data"
	msg = MIMEMultipart()
	msg['Subject'] = SUBJECT 
	msg['From'] = self.EMAIL_FROM
	msg['To'] = self.EMAIL_TO
        msg['cc'] = self.EMAIL_CC
	files = ['result.xlsx','report.xlsx']
	msgtxt = """<html><head></head><body><p>PFA.............</p></br></br><p>Regards</p><p>TAS</p></body></html>"""
	msg.attach( MIMEText(msgtxt,'html') )
	for file_name in files:
	    part = MIMEBase('application', "octet-stream")
	    part.set_payload(open("/var/www/html/Lexis_Link_Monitoring/output/"+file_name, "rb").read())
	    Encoders.encode_base64(part)
	    part.add_header('Content-Disposition', 'attachment; filename="'+file_name+'"')
	    msg.attach(part)

	server = smtplib.SMTP(self.EMAIL_SERVER,25)
	server.login('','')
	server.sendmail(self.EMAIL_FROM, self.EMAIL_TO, msg.as_string())
        server.quit()
	return 'Mail Sent'

if __name__ =='__main__':
       obj = SendMail()
       print obj.processMail()
