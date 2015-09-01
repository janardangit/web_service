import xlrd
import csv
import MySQLdb

def csv_from_excel():

    wb = xlrd.open_workbook('../M_A_URL_2015_05_06.xlsx')
    sh = wb.sheet_by_name('Sheet1')
    csv_file = open('../M_A_URL_2015_05_06.csv', 'wb')
    wr = csv.writer(csv_file, quoting=csv.QUOTE_ALL)

    for rownum in xrange(1,sh.nrows):
        content_ar = sh.row_values(rownum)
        '''new_content_ar = []
        for i, each in enumerate(content_ar):
            if i == 0: 
                new_content_ar.append(each)
            else:
              try:
                print each.encode('utf-8').decode('ascii', 'xmlcharrefreplace')
              except:
                 print [each];sys.exit()
        wr.writerow(new_content_ar)'''
	wr.writerow(content_ar)

    csv_file.close()
    return 'Done';


if __name__ =='__main__':
   tmp = csv_from_excel()
   print tmp
