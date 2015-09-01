import MySQLdb
import getExcelData
import sys


class ExportData:
    def convert(self,txt):
        txt = txt.replace("'", "''")
        txt = txt.replace("\\", "\\\\")
        return txt

    def csv_from_excel(self):
        fname = '../process.xlsx'
        #fname = '../test.xlsx'
        rcDict = getExcelData.getFileData(fname)
        conn = MySQLdb.connect(host='localhost', user='root', passwd='tas123', db='Lexis_Link_Monitoring_New')
        cursor = conn.cursor()
        sheets = rcDict.keys()
        sheets.sort()
        for sheet in sheets:
            sheetdata = rcDict[sheet]
	    nrows = sheetdata['nrows']
	    ncols = sheetdata['ncols']
	    sheet_name = sheetdata['sheet_name']
            stmt1 = 'select week_no from %s order by week_no desc limit 1' %(sheet_name)
            cursor.execute(stmt1)
            weekLst = cursor.fetchall()
            #print weekLst
            last_week_no = 0
            for week in weekLst:
                last_week_no = week[0]
                break
            next_week_no = int(last_week_no) + 1
            #print next_week_no
            #sys.exit()
	    cell_dict = sheetdata['cell_dict']
            for row in range(1, nrows):
                #print "==========================================="
	        rowwiseData = []
                for col in range(0, ncols):
                    data = cell_dict.get((row, col), None)
		    if data:
                       dt = data.get('data', None)
                       try:
                           dt = self.convert(dt)
                       except:
                           pass
                       rowwiseData.append(dt.encode('ascii', 'xmlcharrefreplace'))
                #print rowwiseData
       	        sqlst = "insert into %s(external_link_label,topic_tree_location,external_link_address,response,response_category,ping_date_time,redirect_url,week_no) values('%s','%s','%s','%s','%s','%s','%s',%s)" %(sheet_name,rowwiseData[0],rowwiseData[1],rowwiseData[2],'','','','',next_week_no)
	        cursor.execute(sqlst) 
        return 'Done';


if __name__ =='__main__':
   obj = ExportData()
   tmp = obj.csv_from_excel()
   print tmp
