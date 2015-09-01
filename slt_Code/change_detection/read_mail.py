#!/usr/bin/python
import poplib
from email import parser

class SendMail:
    def __init__(self):
	pass

    def processMail(self):
        pop_conn = poplib.POP3_SSL('pop.gmail.com')
        pop_conn.user('username')
        pop_conn.pass_('password')
        #Get messages from server:
        messages = [pop_conn.retr(i) for i in range(1, len(pop_conn.list()[1]) + 1)]
        # Concat message pieces:
        messages = ["\n".join(mssg[1]) for mssg in messages]
        #Parse message intom an email object:
        messages = [parser.Parser().parsestr(mssg) for mssg in messages]
        msg_lst = []
        for message in messages:
            print message['subject']
            msg_lst.append(message['subject'])
        pop_conn.quit()        
	return msg_lst 

if __name__ =='__main__':
       obj = SendMail()
       print obj.processMail()
