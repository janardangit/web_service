#!/usr/bin/python
# -*- coding:utf-8 -*-
import cgi, cgitb, ast
cgitb.enable()
print "Content-Type: text/html\n\n"

def get_next_list(matching_dig,index_no):
    input_list = [[(1, 2), (7, 8)], [(2, 8), (4, 5), (2, 3)], [(3, 6), (8, 11)], [(7, 32), (6, 10), (11, 12)], [(10, 20), (12, 15)], [(20, 30)]]
    i = 0
    for ind_input_list in input_list:
	if(i < index_no):
            i += 1
            continue
        for ind_input_list2 in ind_input_list:
            if(ind_input_list2[0] == matching_dig):
                return ind_input_list2
    return ''
match_list = []
def get_next_list2(ind_input_list2,i):
    next_list = get_next_list(ind_input_list2[1],i)
    if(next_list != ''):
	i += 1
        match_list.append(next_list)
        get_next_list2(next_list,i)
    return match_list



def display_data():
    input_list = [[(1, 2), (7, 8)], [(2, 8), (4, 5), (2, 3)], [(3, 6), (8, 11)], [(7, 32), (6, 10), (11, 12)], [(10, 20), (12, 15)], [(20, 30)]]
    print "Input: ",input_list
    print "FINAL RESULT DISPLAY"
    print "+++++++++++++++++++++++++"
    i = 0
    for ind_input_list in input_list:
	i += 1
	for ind_input_list2 in ind_input_list:
            final_list = []
            global match_list
	    match_list = []
	    final_list.append(ind_input_list2)
	    get_next_list = get_next_list2(ind_input_list2,i)
	    final_list = final_list + get_next_list
	    print "Final Result: ",final_list
    return '' 
       

if __name__=="__main__":
   tmp = display_data()
   print tmp
