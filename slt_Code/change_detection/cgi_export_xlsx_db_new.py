import MySQLdb
import getExcelData

def convert(txt):
     txt = txt.replace("'", "''")
     txt = txt.replace("\\", "\\\\")
     return txt

def csv_from_excel():
    fname = '../LN_UK_Practice_Area.xls'
    #fname = '../test.xlsx'
    rcDict = getExcelData.getFileData(fname)
    conn = MySQLdb.connect(host='localhost', user='root', passwd='tas123', db='Lexis_Link_Monitoring_week5')
    cursor = conn.cursor()
    sheets = rcDict.keys()
    sheets.sort()
    for sheet in sheets:
        sheetdata = rcDict[sheet]
	nrows = sheetdata['nrows']
	ncols = sheetdata['ncols']
	#sheet_name = sheetdata['sheet_name']
	sheet_name = 'LN_UK_Practice_Area_new'
	cell_dict = sheetdata['cell_dict']
        for row in range(1, nrows):
            print "==========================================="
	    rowwiseData = []
            for col in range(0, ncols):
                data = cell_dict.get((row, col), None)
		if data:
                   dt = data.get('data', None)
		   if col == 2:
		       if 'http://' not in dt and 'https://' not in dt:
		           dt = 'http://'+dt
		   try: 
		   	dt = str(dt)
		   except:
                         pass
                   try:
                       dt = convert(dt)
                   except:
                       pass
                   print [dt]
                   rowwiseData.append(dt.encode('ascii', 'xmlcharrefreplace'))
                   #rowwiseData.append(dt.encode('utf8'))
            print rowwiseData
       	    #sqlst = "insert into %s(external_link_label,topic_tree_location,external_link_address,response,response_category,ping_date_time,redirect_url) values('%s','%s','%s','%s','%s','%s','%s')" %(sheet_name,rowwiseData[0],rowwiseData[1],rowwiseData[2],'','','','')
       	    sqlst = "insert into %s(excel_id,title,external_link_address,practice_area,content_type,location,update_date,page_type,response,response_category,ping_date_time,redirect_url) values('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')" %(sheet_name,rowwiseData[0],rowwiseData[1],rowwiseData[2],rowwiseData[3],rowwiseData[4],rowwiseData[5],rowwiseData[6],rowwiseData[7],'','','','')
	    cursor.execute(sqlst) 
    return 'Done';


if __name__ =='__main__':
   tmp = csv_from_excel()
   print tmp
