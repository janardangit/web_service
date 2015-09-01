var { viewFor } = require("sdk/view/core");
var tab_utils = require("sdk/tabs/utils");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
const {components, Cc, Ci} = require("chrome");
var browser  = require("./browser")
var extr  = require("./browser")
var eventLisiner = require('./event_listener_service')
var extract_urls = require('./extract_multiple_urls_pravat')
var extDom = require("./extract_dom_elements")
var utils = require("./utils")
var TASApp = require("./server_config").TASApp;
const { getMostRecentBrowserWindow } = require('sdk/window/utils');
getMostRecentBrowserWindow().minimize();
getMostRecentBrowserWindow().BrowserFullScreen();
var system = require("sdk/system");

//utils.Logger.push("TABS === "+numTabs);
//system.exit();

//require("sdk/preferences/service").set('browser.tabs.loadDivertedInBackground', true);

var table_name = 'labor_employment'; 
var ids = ["1201"]; 
//var table_name = system.staticArgs.table_name;
//var ids = system.staticArgs.ids;

function load_all_urls(){
	console.log('table_name : '+table_name);
        eventLisiner.set_extd_load_progress();
        browser.Browser.add_progress_listener();
	var json_data = {'table_name':table_name,'ids':ids};
        var cgi = TASApp.config.IP+TASApp.config.CGI_DIR + 'change_detection/cgi_get_url_details_new.py?input_str='+JSON.stringify(json_data);
        utils.Logger.push("get All urls === "+cgi);
	TASApp.gbl.tab = new Object(); 
	TASApp.gbl.tab.process_all_urls = process_all_urls;
        utils.send_ajax_request(cgi, null, 1, "TASApp.gbl.tab.process_all_urls(json)", "GET", true);
}
load_all_urls();
function process_all_urls(json){
	console.log("START");
	row_json = [];
        var list_of_urls = json.data;
        TASApp.gbl.date_dir = json.date_dir;
        for(var i=0;i<list_of_urls.length;i++){
                var data = {'doc_id': list_of_urls[i][0], 'main_doc_id':list_of_urls[i][0], 'user_id':TASApp.gbl.user_id, url:encodeURIComponent(list_of_urls[i][1].trim()), action:'no', c_index:[[],"",""], on_complete:"", main_page:true, extract_only_event:1, action_type:'link'};
                var url = "http://www.andrewskurth.com/assets/pdf/article_1074.pdf"
                var url = "https://lexismarkettracker.lexisnexis.com/transactions/128#f916"
                var url = "http://www.lockelord.com/files/Publication/9890c861-6da3-468e-a1ad-18fc65a32533/Preview/PublicationAttachment/78575934-2804-4d88-a9c9-1c8ea330d4b7/mergersacquisitions_2014-02_18th_SECIssues_Renetzky.pdf"
		var url = "http://www.morganlewis.com/pubs/Antitrust_LF_FTCRaisesHart-Scott-RodinoThresholds_16jan15.pdf"
		var url = "http://www.ssd.com/files/Publication/d392f8d9-b8ae-4d48-b22a-65f16ed3a272/Presentation/PublicationAttachment/6372ebc4-dc2c-42d8-9777-67fa00301275/Squire-Sanders-Life-Sciences-M-and-A.PDF"
		var url = "http://www.squirepattonboggs.com/professionals/a/abelovska-lenka"
		//var url = "https://news.google.co.in/nwshp?hl=en&tab=wn&ei=tIhMVejOBtfluQSu8IGACA&ved=0CAUQqS4oBQ"
		url = "http://www.ftc.gov/bc/hsr/faq.shtm"
		//url = "http://sec.gov/divisions/corpfin/guidance/sasinterp.htm"
		url = "http://www.gsk.com/en-gb/media/press-releases/"
                //var data = {'doc_id': list_of_urls[i][0], 'main_doc_id':list_of_urls[i][0], 'user_id':TASApp.gbl.user_id, url:encodeURIComponent(url), action:'no', c_index:[[],"",""], on_complete:"", main_page:true, extract_only_event:1, action_type:'link'};
                data.page_type          = "RENDER PAGE";
                data.table_name          = table_name;
		//data.mark_first = true;
		row_json.push(data);
		//if (i >= 100)
       //            break;
	}
	//var url = "http://www.gsk.com/en-gb/media/press-releases/"
	//url = "http://www.ftc.gov/bc/hsr/faq.shtm"
        //var data = {'doc_id': 5423, 'main_doc_id':5423, 'user_id':TASApp.gbl.user_id, url:encodeURIComponent(url), action:'no', c_index:[[],"",""], on_complete:"", main_page:true, extract_only_event:1, action_type:'link'};
	//row_json.push(data);
	require('./proxy_main').proxy_start();
        try{require('./browsec').start();}catch(e){console.log('=============='+e)}
	start_render(row_json)
}

function start_render(urls){
        TASApp.config.PROC      = "";
        //var wnd         = Panel.main_window.document.getElementById('content').contentWindow.top.window;
        //content         = wnd;
	var prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
	prefService.setIntPref("browser.link.open_newwindow", 3);
	//prefService.setIntPref("browser.link.open_newwindow");
        browser.Browser.start_extract_urls(urls);
}


/*tabs.open({
  //url: "http://www.yahoo.co.in",
  url: "http://www.techmeme.com/",
  tab_index : '1',
  tab_click : 'click',
  tab_position :'1'
  //url: "http://www.houzz.com/ideabooks/47462136/list/houzz-tour-a-divided-london-home-comes-together-again",
  //url: "http://www.squirepattonboggs.com/professionals/a/abelovska-lenka",
  //onReady: runScript
  //onLoad: runScript
});*/

/*
function writeTextToFile(text, fname){
  const { pathFor } = require('sdk/system');
  const path = require('sdk/fs/path');
  var fileIO = require("sdk/io/file");
  //var filename = path.join(pathFor('Home'), fname);
  var filename = path.join(pathFor('TmpD'), fname);
  var TextWriter = fileIO.open(filename, "w");
  if (!TextWriter.closed) {
    TextWriter.write(text);
    TextWriter.close();
  }
}

function runScript(tab) {
	var lowLevelTab = viewFor(tab);
        var browser = tab_utils.getBrowserForTab(lowLevelTab);
	document = browser.contentDocument;
	//console.log('HTML'+document.body.innerHTML);
	var outd = {'html':""};
	var res = extDom.get_dom_tree(document.body, 0, document, 1, outd);
	console.log('DATA : '+outd.html.outerHTML);
	var path = "body.html";
	writeTextToFile(outd.html.outerHTML, path);
	//tabs.close();
}*/
