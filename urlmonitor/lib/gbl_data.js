/*******************************************************************************
 * Author   : Angamuthu G
 * Date     : Jan 16, 2014
 * Brief    : Initialize global variables
 *
 ********************************************************************************/ 
TASApp.gbl = {
        user_id             : 0,
        agent_id            : 0,
        mgmt_id             : 1,
        doc_id              : 0,
        role                : '',
        name                : '',
        batch_id            : 0,
        login_id            : 0,
	group_id	    : 1,
        email               : '',
        home_page           : '',
        home_url            : '',
        home_url            : '',
        old_url             : '',
        page_type           : '',
        baseurl             : '',
	doc_ids		    : {},
	parent_id	    :"NULL",
	logo		    : '30px',
	tab		    : '30px',
	tab_menu	    : '25px',
	tree_header   	    : '25px',
	crop_tool	    : '30px',
	footer		    : '25px',	
	extd_indexs	    : [2, 234, 236, 238],
	page_conti	    : 238,
	stage_ids	    : [],
	navigation_taxo	    : [233, 234],
	pagination_taxo	    : [235, 236, 237, 238],
	trees	            : {},
	navigation_index    : [],
	navigation_dict	    : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y","Z"],
        sign_on_off_flag    : "Y", 
}
TASApp.dom_tree = {record:{}};
TASApp.dom_json_tree = {};
TASApp.gbl.reset_keys	= {
        agent_id            : 0,
        mgmt_id             : 1,
        doc_id              : 0,
        batch_id            : 0,
        home_page           : '',
        home_url            : '',
        home_url            : '',
        old_url             : '',
        page_type           : '',
        baseurl             : '',
	doc_ids		    : {},
	parent_id	    :"NULL",
}

var Ci	= Components.interfaces;
var Cu 	= Components.utils;
var Cc 	= Components.classes;
Cu.import("resource://gre/modules/NetUtil.jsm");  
Cu.import("resource://gre/modules/FileUtils.jsm");
var wm 			= Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
var ww 			= Cc["@mozilla.org/embedcomp/window-watcher;1"].getService(Ci.nsIWindowWatcher);
var wnd_utils 	= window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
var gBrowser 	= wm.getMostRecentWindow("navigator:browser").gBrowser;
var Cil         = Components.interfaces.nsIWebProgressListener;
var log_services	    = Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService);
const STATE_START       = Cil.STATE_START;
const STATE_STOP        = Cil.STATE_STOP;
const STATE_IS_REQUEST  = Cil.STATE_IS_REQUEST;
const STATE_IS_DOCUMENT = Cil.STATE_IS_DOCUMENT;
const STATE_IS_WINDOW   = Cil.STATE_IS_WINDOW;
const STATE_IS_NETWORK  = Cil.STATE_IS_NETWORK;
var session_storage	= Cc['@mozilla.org/browser/sessionstore;1'].getService(Ci.nsISessionStore);
var dom_serializer 	= Cc["@mozilla.org/xmlextras/xmlserializer;1"].createInstance(Ci.nsIDOMSerializer);
var gbl_last_click_element_attr	= [];
