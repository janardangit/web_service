#!/usr/bin/python
import getExcelData2
import xlwt


lst_category = ["Summaries_data","Sectors_data","Instruments_data","Balance_Sheet_and_Changes_in_Net_Worth_data","Supplementary_Tables_data","Integrated_Macroeconomic_Accounts_for_the_United_States_data"]

def convert(txt):
     txt = txt.replace("'", "''")
     txt = txt.replace("\\", "\\\\")
     return txt

def save_excel(workbook, diff_dict,row_value,sheet_name):
    new_title = diff_dict
    sheet_two_titles = row_value
    worksheet = workbook.add_sheet(sheet_name)
    desc_col = worksheet.col(3)
    desc_col.width = 256 * 100
    style = xlwt.XFStyle()
    # font
    font = xlwt.Font()
    font.bold = True
    style.font = font
    # borders
    borders = xlwt.Borders()
    borders.bottom = xlwt.Borders.THIN
    style.borders = borders

    alignment = xlwt.Alignment()
    alignment.horz = xlwt.Alignment.HORZ_CENTER
    style.alignment = alignment

    worksheet.write_merge(0, 0,4, 5, '',style=style)
    worksheet.write_merge(0, 0, 6, 7, 'Flows',style=style)
    worksheet.write_merge(0, 0, 8, 9, 'Levels',style=style)
    worksheet.write_merge(0, 0, 10, 11, 'Balance Sheet',style=style)
    worksheet.write_merge(0, 0, 12, 13, 'Reconciliations',style=style)

    header_lst = ['Sl.No','Date','Category','Title','Table','Page','Table','Page','Table','Page','Table','Page','Table','Page']
    row = 1
    col = 0
    for header in header_lst:
        worksheet.write(row, col,header,style=style)
        col += 1
    row += 1
    diff_records = 0
    for key in lst_category:
        data = new_title.get(key)
        if len(data) != 0:
            diff_records = 1
            sl = 1
            for ind_category in data:
                row_array = sheet_two_titles[ind_category][0]
                print ">>>",row_array
                col = 0
                worksheet.write(row, col,sl)
                sl += 1
                col += 1
                worksheet.write(row, col,'')
                sl += 1
                col += 1
                worksheet.write(row, col,key.replace('_data','').replace('_',' '))
                col += 1
                for k in range(1,len(row_array)):
                    worksheet.write(row, col,row_array[k])
                    col += 1
                row += 1
    if not diff_records:
        col = 0
        for k in range(0,14):
            worksheet.write(row, col,'N/A')
            col += 1

    return


def read_from_excel():
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
        #lst_category = ["Summaries_data","Sectors_data","Instruments_data","Balance_Sheet_and_Changes_in_Net_Worth_data","Supplementary_Tables_data","Integrated_Macroeconomic_Accounts_for_the_United_States_data"]
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
    workbook = xlwt.Workbook()
    save_excel(workbook, new_title,sheet_two_titles,'New_FED_Descriptions')
    save_excel(workbook, old_title,sheet_one_titles,'Old_FED_Descriptions')
    save_excel(workbook, old_pg,sheet_one_page,'Old_Pages')
    workbook.save('/var/www/html/Lexis_Link_Monitoring/output/diff_result.xlsx')

    return 'Done';


if __name__ =='__main__':
   tmp = read_from_excel()
   print tmp
