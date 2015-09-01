import csv
import MySQLdb
#from time import gmtime, strftime

def csv_to_db():
    with open('../M_A_URL_2015_05_06.csv','rb') as file:
       contents = csv.reader(file)
       conn = MySQLdb.connect(host='localhost', user='root', passwd='tas123', db='Lexis_Link_Monitoring')
       cursor = conn.cursor()
       for row in contents:
          #date_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
          row[1] = row[1].replace("'","\\'")
          row[2] = row[2].replace("'","\\'")
          row[2] = row[2].replace("\\","\\\\")
          row[3] = row[3].replace("'","\\'")
          row[4] = row[4].replace("'","\\'")
          row[5] = row[5].replace("'","\\'")
          row[6] = row[6].replace("'","\\'")
          sqlst = "insert into url_master(external_link_label,topic_tree_location,external_link_address,response,response_category,ping_date_time) values('%s','%s','%s','%s','%s','%s')" %(row[1],row[2],row[3],row[4],row[5],row[6])
          
          print sqlst
          cursor.execute(sqlst);

    return 'Done';


if __name__ =='__main__':
   tmp = csv_to_db()
   print tmp
