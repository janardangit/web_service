import MySQLdb
import getExcelData

def convert(txt):
     txt = txt.replace("'", "''")
     txt = txt.replace("\\", "\\\\")
     return txt

def csv_from_excel():
    fname = '../External_Links_Report_Module_Breakdown_with_Summary_5_22_15.xlsx'
    #fname = '../test.xlsx'
    rcDict = getExcelData.getFileData(fname)
    conn = MySQLdb.connect(host='localhost', user='root', passwd='tas123', db='Lexis_Link_Monitoring_New')
    cursor = conn.cursor()
    sheets = rcDict.keys()
    sheets.sort()
    i = 1
    for sheet in sheets:
        if(i == 1):
            i += 1
            continue
        sheetdata = rcDict[sheet]
	nrows = sheetdata['nrows']
	ncols = sheetdata['ncols']
	sheet_name = sheetdata['sheet_name']
	cell_dict = sheetdata['cell_dict']
        for row in range(3, nrows):
            print "==========================================="
	    rowwiseData = []
            for col in range(1, ncols):
                data = cell_dict.get((row, col), None)
		if data:
                   dt = data.get('data', None)
                   try:
                       dt = convert(dt)
                   except:
                       pass
                   rowwiseData.append(dt.encode('ascii', 'xmlcharrefreplace'))
            print rowwiseData
       	    sqlst = "insert into %s(external_link_label,topic_tree_location,external_link_address,response,response_category,ping_date_time,redirect_url,week_no) values('%s','%s','%s','%s','%s','%s','%s',%s)" %(sheet_name,rowwiseData[0],rowwiseData[1],rowwiseData[2],'','','','',3)
	    cursor.execute(sqlst) 
    return 'Done';


if __name__ =='__main__':
   tmp = csv_from_excel()
   print tmp
