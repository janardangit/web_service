import MySQLdb
import getExcelData

def convert(txt):
     txt = txt.replace("'", "''")
     txt = txt.replace("\\", "\\\\")
     return txt

def csv_from_excel():
    fname = '../External_Links_Report_Module_Breakdown_with_Summary_8_14_15.xls'
    #fname = '../test.xlsx'
    rcDict = getExcelData.getFileData(fname)
    conn = MySQLdb.connect(host='localhost', user='root', passwd='tas123', db='Lexis_Link_Monitoring_week14')
    cursor = conn.cursor()
    table_lst = {'B&F':'banking_finance','Business Law':'business_law','CA Bus Entity':'california_business_entity_selection_formation','Combined Bus Entity Selection':'combined_california_general_business_law','Bankruptcy':'commercial_bankrtupcy','Corp Counsel':'corporate_counsel','IP':'intellectual_property','L&E':'labor_employment','M&A':'m_a','NY B&C':'ny_business_commercial','Real Estate':'real_estate','S&CM':'securities_capital_markets','Texas B&C':'texas_business_commercial'}
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
	sheet_name = table_lst[sheet_name]
	cell_dict = sheetdata['cell_dict']
        for row in range(3, nrows):
            print "==========================================="
	    rowwiseData = []
            for col in range(1, ncols):
                data = cell_dict.get((row, col), None)
		if data:
                   dt = data.get('data', None)
		   if col == 3:
		       if 'http://' not in dt and 'https://' not in dt:
		           dt = 'http://'+dt
                   try:
                       dt = convert(dt)
                   except:
                       pass
                   rowwiseData.append(dt.encode('ascii', 'xmlcharrefreplace'))
            print rowwiseData
       	    sqlst = "insert into %s(external_link_label,topic_tree_location,external_link_address,response,response_category,ping_date_time,redirect_url) values('%s','%s','%s','%s','%s','%s','%s')" %(sheet_name,rowwiseData[0],rowwiseData[1],rowwiseData[2],'','','','')
	    print sqlst
	    cursor.execute(sqlst) 
    return 'Done';


if __name__ =='__main__':
   tmp = csv_from_excel()
   print tmp
