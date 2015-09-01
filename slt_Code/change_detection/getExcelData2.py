#from openpyxl import Workbook, load_workbook
import xlrd


def __readExcelX(fname):
    #wb2 = load_workbook(fname)
    #sheets = wb2.get_sheet_names()
    #print sheets
    return

def __readExcel(fname):
    wb = xlrd.open_workbook(fname)
    sheet = wb.sheet_by_index(0)
    sheets = wb.sheets()
    bookDict = {}
    for i, each_sheet in enumerate(sheets):
        #print 'sheet Name : ', each_sheet.name
        #print 'no of cols : ', each_sheet.ncols
        #print 'no of rows : ', each_sheet.nrows
        bookDict[i] = {}
        bookDict[i]['sheet_name'] = each_sheet.name
        bookDict[i]['ncols'] = each_sheet.ncols
        bookDict[i]['nrows'] = each_sheet.nrows 
        cellDict = {}
        for row in range(each_sheet.nrows):
            for col in range(each_sheet.ncols):
                #print each_sheet.cell_value(row, col).strip(), '\t',
                cellDict[(row, col)] = {}
                cellDict[(row, col)]['data'] = each_sheet.cell_value(row, col) 
        bookDict[i]['cell_dict'] = cellDict 
    #data = [sheet.cell_value(0, col) for col in range(sheet.ncols)]
    #print data
    return bookDict

def getFileData(fname):
    return __readExcel(fname)


#fname = '../M_A_URL_2015_05_06.xlsx'
#print getFileData(fname)
