import os, sys
import os.path
import json
import urllib
import time

class URLRender(object):
    def __init__(self):
        return

    def __get_lines(self, ifname):
        lines = []
        if os.path.isfile(ifname):
            fd = open(ifname, 'r')
            lines = fd.readlines()
            fd.close()
            lines = [line for line in lines if line.strip()]
        return lines


    def urlProcessing(self, rende_data, ipAddress = "172.16.20.150"):
        try:
            service_str = "http://%s:9775/submit_test?data=%s" %(ipAddress, str(rende_data))
            print service_str
            f = urllib.urlopen(service_str)
            res = f.read()
            print "rendering return ==========>>>>>>>>>>>.", res
            return res
        except Exception, args:
            print "Exception ------------>>>>>>>>>> ", str(args)
        return

    def url_render_new(self, table_name,ids):
	rdata = {}
	rdata['table_name'] = table_name 
	rdata['ids'] = ids 
        res = json.dumps(rdata)
        res = urllib.quote(res)
        self.urlProcessing(res);
    	return 


    def __url_render(self, iline, delimiter):
        if iline:
            docid, opath, url, rparms = iline.split(delimiter)

            #rdata = {'renderData': [{'doc_id':1, 'opath': "", 'url': "http://www.thompsoncoburn.com/people/find-a-professional/john-rogers.aspx", 'sign': ['#p7APMw1_4', '#p7APMw1_5', '#p7APMw1_11', '#p7APMw1_8', '#p7APMw1_10'], 'pos':[-1], 'cond':[], 'action':['update', 'update', 'update', 'update', 'update'], 'new_value':[[['height', "auto", 1, ]], [['height', "auto", 1, ]], [['height', "auto", 1, ]], [['height', "auto", 1, ]], [['height', "auto", 1, ]]]}]}


            d = {}
            d['doc_id'] = docid
            d['opath'] = opath
            d['url'] = url
            d['sign'] = []
            d['pos'] = [-1]
            d['cond'] = []
            d['action'] = []
            d['new_value'] = []
            if 1 and rparms:
                cname, action, pos = rparms.split(',')
                d['sign'].append(cname.strip())
                d['action'].append(action.strip())
                d['pos'] = [int(pos.strip())]

            rdata = {}
            rdata['renderData'] = [d]

            res = json.dumps(rdata)
            res = urllib.quote(res)
            self.urlProcessing(res);
        return

    def run(self, ifname, delimiter='^!!^'):

        lines = self.__get_lines(ifname)

        tsize = len(lines)
        for i, line in enumerate(lines):
            docid = line.split(delimiter)[0]
            print 'running - %s/%s: %s' %(str(i), str(tsize), str(docid))
            self.__url_render(line, delimiter)
            pass
        return

    def debug(self):
        return

def main(argv):
        import getopt

        def usage():
            print ('Usage: %s -f <ifname> [-h]' % argv[0])
            sys.exit(2)

        try:
            (opts, args) = getopt.getopt(argv[1:], 'hf:', ["--help", "--ifname"])
        except getopt.GetoptError:
            print 'Invalid key...'
            return usage()

        ifname = None
        for (key, value) in opts:
            if key in ("-h", "--help"):
                usage()
            elif key in ("-f", "--ifname"):
                ifname = value
            else:
                print 'invalid key...'
                usage()

        # ifname
        if not ifname:
            print 'ifname not defined...'
            usage()

        # run
        obj = URLRender()
        obj.run(ifname)

        return 0

if __name__=='__main__':
    #sys.exit(main(sys.argv))
    URLRender().url_render_new([])

