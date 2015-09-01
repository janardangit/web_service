#!/usr/bin/python

import sys,os
import web
import MySQLdb
import ast
import json

urls = ('/submit_test', 'render_service')
app = web.application(urls, globals())
class render_service:
    def connection(self, vhost, vdbname):
        vpasswd = 'tas123'
        vuser = 'root'
        conn = MySQLdb.connect(host=vhost, user=vuser, passwd=vpasswd, db=vdbname)
        cursor = conn.cursor()
        return cursor, conn


    def getFileName(self, doc_id, ip_addr, project_id):
        filename = ''
        cur, conn = self.connection(ip_addr, project_id)
        stmt = "select document_name from document_master where document_id =%s" %(doc_id)
        print stmt
        cur.execute(stmt)
        res = cur.fetchall()
        conn.close()
        if res:
            filename = res[0][0]
        return filename

    def RenderUrl(self, renderData):
        cmd = "cfx run --static-args='%s' > /dev/null 2>&1" %(renderData)
        #cmd = 'cfx run --static-args="%s" > /dev/null 2>&1' %(renderData)
        #cmd = 'cfx run > /dev/null 2>&1'
        print cmd
        os.system(cmd)
        return "DONE"

    def GET(self):
        x = web.input()
        renderData = x['data']
        print type(renderData)
        res = self.RenderUrl(renderData)
        html_str = '<html><body>'+res+'</body></html>'
        return res


if __name__=="__main__":
    ####  port :9775
    ####  python2.6 render_service.py 9775


    obj = render_service()
    app = web.application(urls, globals())
    app.run()
 
