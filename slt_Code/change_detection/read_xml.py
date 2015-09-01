#!/usr/bin/python
import xml.etree.ElementTree as ET

tree = ET.parse('../test.xml')
root = tree.getroot()


class get_user:
    def GET(self):
        usr_lst = []
	for child in root:
	    usr_lst.append(str(child.attrib['name']))
        print usr_lst


if __name__ == "__main__":
    obj = get_user()
    tmp = obj.GET()
