import MySQLdb
import getExcelData2

def convert(txt):
     txt = txt.replace("'", "''")
     txt = txt.replace("\\", "\\\\")
     return txt

def csv_from_excel():
    fname = '../case_test.xls'
    rcDict = getExcelData2.getFileData(fname)
    sheets = rcDict.keys()
    sheets.sort()
    sheet_one_titles = [] 
    sheet_one_table = []
    sheet_one_page = []
    sheet_two_titles = []
    sheet_two_table = []
    sheet_two_page = []
    i = 1;
    for sheet in sheets:
        sheetdata = rcDict[sheet]
	nrows = sheetdata['nrows']
	ncols = sheetdata['ncols']
	sheet_name = sheetdata['sheet_name']
	cell_dict = sheetdata['cell_dict']
        for row in range(3, nrows):
            #print "==========================================="
	    rowwiseData = []
            for col in range(0, ncols):
            #for col in range(1, 4):
                data = cell_dict.get((row, col), None)
		if data:
                   dt = data.get('data', None)
  		   if dt:
                        try:
 	                   dt = str(dt)
                           dt = convert(dt)
                        except:
                           pass
                   rowwiseData.append(dt.encode('ascii', 'xmlcharrefreplace'))
            if i == 1:
	        sheet_one_titles.append(rowwiseData[1])
                for key in range(2,len(rowwiseData)):
                    if rowwiseData[key] and key%2 == 0:
                        sheet_one_table.append(rowwiseData[key])
                    elif rowwiseData[key] and key%2 != 0:
	                sheet_one_page.append(rowwiseData[key])
            else:
                sheet_two_titles.append(rowwiseData[1])
                for key in range(2,len(rowwiseData)):
                    if rowwiseData[key] and key%2 == 0:
                        sheet_two_table.append(rowwiseData[key])
                    elif rowwiseData[key] and key%2 != 0:
                        sheet_two_page.append(rowwiseData[key])
        i += 1
            #print rowwiseData
    print "+++++++++++++++++++++++++++++++++++++++"
    print sheet_one_titles
    print "+++++++++++++++++++++++++++++++++++++++"
    print sheet_two_titles
    print "+++++++++++++++++++++++++++++++++++++++"
    print sheet_one_table
    print "+++++++++++++++++++++++++++++++++++++++"
    print sheet_two_table
    print "++++++++++++++++++++++++++++++++++++++++"
    print sheet_one_page
    print "+++++++++++++++++++++++++++++++++++++++"
    print sheet_two_page
    return 'Done';


if __name__ =='__main__':
   tmp = csv_from_excel()
   print tmp
