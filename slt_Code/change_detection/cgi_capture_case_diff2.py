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
    sheet_one_titles = {} 
    sheet_one_table = {}
    sheet_one_page = {}
    sheet_two_titles = {}
    sheet_two_table = {}
    sheet_two_page = {}
    i = 1;
    for sheet in sheets:
        category_key = 0
        sheetdata = rcDict[sheet]
	nrows = sheetdata['nrows']
	ncols = sheetdata['ncols']
	sheet_name = sheetdata['sheet_name']
	cell_dict = sheetdata['cell_dict']
        lst_category = ["Summaries_data","Sectors_data","Instruments_data","Balance_Sheet_and_Changes_in_Net_Worth_data","Supplementary_Tables_data","Integrated_Macroeconomic_Accounts_for_the_United_States_data"]
        for row in range(3, nrows):
            #print "==========================================="
	    rowwiseData = []
            for col in range(0, ncols):
            #for col in range(1, 4):
                data = cell_dict.get((row, col), None)
		if data:
                   dt = data.get('data', None)
                   try:
                        dt = dt.strip()
                   except:
                        pass
  		   if dt:
                        try:
 	                   dt = str(dt)
                           dt = convert(dt)
                        except:
                           pass
                   rowwiseData.append(dt.encode('ascii', 'xmlcharrefreplace'))
            category = 1
            for key in range(2,len(rowwiseData)):
                #print 'element >>>',rowwiseData[key],"key>>",key
                if rowwiseData[key]:
                    category = 0
                    break
            if category == 1 and i == 1:
                sheet_one_titles[lst_category[category_key]] = []
                sheet_one_table[lst_category[category_key]] = []
                sheet_one_page[lst_category[category_key]] = [] 
                category_key += 1;
            elif category == 1 and i == 2:
                sheet_two_titles[lst_category[category_key]] = []
                sheet_two_table[lst_category[category_key]] = []
                sheet_two_page[lst_category[category_key]] = []
                category_key += 1;
            #print 'category key>>',category_key
            #print 'category >>',category
            if i == 1:
	        sheet_one_titles[lst_category[category_key-1]].append(rowwiseData[1])
                sheet_one_titles[rowwiseData[1]] = []
                sheet_one_titles[rowwiseData[1]].append(rowwiseData)
                for key in range(2,len(rowwiseData)):
                    if rowwiseData[key] and key%2 == 0:
                        sheet_one_table[lst_category[category_key-1]].append(rowwiseData[key])
                        sheet_one_table[rowwiseData[key]] = []
                        sheet_one_table[rowwiseData[key]].append(rowwiseData)
                    elif rowwiseData[key] and key%2 != 0:
	                sheet_one_page[lst_category[category_key-1]].append(rowwiseData[key])
                        sheet_one_page[rowwiseData[key]] = []
                        sheet_one_page[rowwiseData[key]].append(rowwiseData)
            else:
                sheet_two_titles[lst_category[category_key-1]].append(rowwiseData[1])
                sheet_two_titles[rowwiseData[1]] = []
                sheet_two_titles[rowwiseData[1]].append(rowwiseData)
                for key in range(2,len(rowwiseData)):
                    if rowwiseData[key] and key%2 == 0:
                        sheet_two_table[lst_category[category_key-1]].append(rowwiseData[key])
                        sheet_two_table[rowwiseData[key]] = []
                        sheet_two_table[rowwiseData[key]].append(rowwiseData)
                    elif rowwiseData[key] and key%2 != 0:
                        sheet_two_page[lst_category[category_key-1]].append(rowwiseData[key])
                        sheet_two_page[rowwiseData[key]] = []
                        sheet_two_page[rowwiseData[key]].append(rowwiseData)
        i += 1
            #print rowwiseData
    #print "+++++++++++++++++++++++++++++++++++++++"
    #print sheet_one_titles
    #print "+++++++++++++++++++++++++++++++++++++++"
    #print sheet_two_titles
    #print "+++++++++++++++++++++++++++++++++++++++"
    #print sheet_one_table
    #print "+++++++++++++++++++++++++++++++++++++++"
    #print sheet_two_table
    #print "++++++++++++++++++++++++++++++++++++++++"
    #print sheet_one_page
    #print "+++++++++++++++++++++++++++++++++++++++"
    #print sheet_two_page
    new_tbl = {}
    old_tbl = {}
    new_pg = {}
    old_pg = {}
    new_title = {}
    old_title = {}
    for keys in lst_category:
        new_tbl[keys] = []
        old_tbl[keys] = []
        new_pg[keys] = []
        old_pg[keys] = []
        new_title[keys] = []
        old_title[keys] = []
        new_tbl_lst = sheet_two_table[keys]
        old_tbl_lst = sheet_one_table[keys]
        new_tbl[keys] = list(set(new_tbl_lst) - set(old_tbl_lst))
        old_tbl[keys] = list(set(old_tbl_lst) - set(new_tbl_lst))
        new_pg_lst = sheet_two_page[keys]
        old_pg_lst = sheet_one_page[keys]
        new_pg[keys] = list(set(new_pg_lst) - set(old_pg_lst))
        old_pg[keys] = list(set(old_pg_lst) - set(new_pg_lst))
        new_tit_lst = sheet_two_titles[keys]
        old_tit_lst = sheet_one_titles[keys]
        new_title[keys] = list(set(new_tit_lst) - set(old_tit_lst))
        old_title[keys] = list(set(old_tit_lst) - set(new_tit_lst))
    print "======================================="
    print new_tbl
    print "======================================="
    print new_pg
    print "======================================="
    print new_title
    print "======================================="
    print old_tbl
    print "======================================="
    print old_pg
    print "======================================="
    print old_title
    print "======================================="
    print sheet_two_titles['Federal Government Employee Retirement Funds: Defined Contribution Plans']
    print sheet_one_titles['State and Local Government Employee Retirement Funds: Defined Benefit Plans']
    return 'Done';


if __name__ =='__main__':
   tmp = csv_from_excel()
   print tmp
