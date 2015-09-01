#!/usr/bin/python
import getExcelData2
import cgitb
cgitb.enable()
import sys 
print 'content-type:text/html\n'
#import xlwt
#class t:
def convert(txt):
     txt = txt.replace("'", "''")
     txt = txt.replace("\\", "\\\\")
     return txt
class check_diff:
	def read_from_excel(self):
	    fname = '../case_test.xls'
	    rcDict = getExcelData2.getFileData(fname)
	    sheets = rcDict.keys()
	    sheets.sort()
	    category = {}
	    main_table = {}
	    sheets_name = []
	    for sheet in sheets:
		sheetdata = rcDict[sheet]
		nrows = sheetdata['nrows']
		ncols = sheetdata['ncols']
		sheet_name = sheetdata['sheet_name']
		sheets_name.append(sheet_name)
		category[sheet_name] = {} 
		main_table[sheet_name] = []
		cell_dict = sheetdata['cell_dict']
		count = 0
		for row in range(3, nrows):
		    rowwiseData = []
		    for col in range(0, ncols):
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
		    category_chk = 1
		    for key in range(2,len(rowwiseData)):
			if rowwiseData[key]:
			    category_chk = 0
			    break
		    if category_chk == 1:
			#category[sheet_name].append(rowwiseData[1])
			category_index = rowwiseData[1]
			main_table[sheet_name].append(category_index)
			category[sheet_name][category_index] = []
			continue
		    category[sheet_name][category_index].append(rowwiseData)
		#print category,"</br>",main_table,"</br>",sheets_name
	    #print main_table,"</br>",sheets_name
	    main_table_per_sheet = []
	    for sheet in sheets_name:
		print main_table.get(sheet)
		main_table_per_sheet.append(main_table.get(sheet))
		print len(main_table.get(sheet))
		#for table in main_table.get(sheet):
		    #print "==========================================================================="
		    #print category[sheet][table]
		    #sys.exit()
	    #new table added check
	    new_table_added = []
	    new_table_added = list(set(main_table_per_sheet[1])-set(main_table_per_sheet[0]))
	    #print ">>>>",new_table_added

	    diff1_lst = []
	    diff2_lst = []
	    for table in main_table_per_sheet[1]:
		sheet1_data = category['Current_quarter_data'][table] 
		sheet2_data = category['Pre_quarter_data'][table]
		
		#new row added or old row removed check
		no_new_added = len(sheet1_data) - len(sheet2_data)
		no_old_removed = len(sheet2_data) - len(sheet1_data)
		new_rows_added = []
		old_rows_removed = []
		if no_new_added > 0:
		    for k in range(len(sheet1_data)-no_new_added , len(sheet1_data)):
			new_rows_added.append(sheet1_data[k])
		if no_old_removed > 0:
		    for l in range(len(sheet2_data)-no_old_removed , len(sheet2_data)):
			old_rows_removed.append(sheet2_data[l])
		#print new_rows_added
		#print old_rows_removed

		#Each element check
		for i in range(len(sheet1_data)):
		    #diff_lst.append([set(sheet1_data[i]) - set(sheet2_data[i])] if len([set(sheet1_data[i]) - set(sheet2_data[i])]))
		    '''
		    if len(list(set(sheet1_data[i]) - set(sheet2_data[i]))):
			diff1_lst.append((i,sheet1_data[i],list(set(sheet1_data[i]) - set(sheet2_data[i]))))
		    if len(list(set(sheet2_data[i]) - set(sheet1_data[i]))):
			diff2_lst.append((i,sheet2_data[i],list(set(sheet1_data[i]) - set(sheet2_data[i]))))
		    '''
		    for j in range(len(sheet1_data[i])):
			if(sheet1_data[i][j] != sheet2_data[i][j]):
			    diff1_lst.append((i,j,sheet1_data[i],sheet1_data[i][j],sheet2_data[i][j]))
			
		    
		
	    print diff1_lst
	    #print diff2_lst

	    return 'Done';


if __name__ =='__main__':
   obj = check_diff()
   tmp = obj.read_from_excel()
   #tmp = read_from_excel()
   print tmp 
