/*****************************************************************************
 * Author	: Angamuthu G
 * Date		: Jan 09,2014
 * Brief	: 
 *****************************************************************************/ 
exports.extract_from_new_window = extract_from_new_window;
var tab_utils = require("sdk/window/utils");
var eventLisiner = require('./event_listener_service')
var webExtract = require('./extract_multiple_urls_pravat').webExtract;
var gBrowser = tab_utils.getMostRecentBrowserWindow().gBrowser;
var { setTimeout, clearTimeout } = require("sdk/timers");
const {components, Cc, Ci} = require("chrome");
var utils = require("./utils")
var TASApp = require("./server_config").TASApp;
var set_extd_load_progress = require("./event_listener_service").set_extd_load_progress;
exports.Browser	= {
    canvas_max_height	: 30000,
	tab_limit		: 6,
	tab_urls		: [],
	timeout			: 8,
	cgi_retry		: 5,
	extraction_delay	: 20000,
	extraction_start_delay	: 3000,
	cgi_stack		: [],
	tab_count		: 0,
	cgi_progress_count	: 0,
	logging			: true,
	doc_id			: 0,
	doc_ids			: {},
	extension_type		: {popup:'N', external_page:'N', js_slide:'N',multi_click:'N'},
	extraction_multi_click_delay:6000,
	/*
	*
	* Date         : Aug 27, 2013
 	* Brief        : Add new tab and load urls & Initiate progress listener event to browser.
	* Parameters   :
	*/
	init:function(){
		utils.Logger.push("Init "+this.tab_urls.length);
		this.action	= 'click';
		//this.add_progress_listener();
		var process_url	= false;
		utils.Logger['global']	= new Array();
		for(var tab_ind  = 0;tab_ind<this.tab_limit;tab_ind++){
			var url		=  this.get_url_with_no_click();
			if(!url) continue;
			utils.Logger.push("data "+url.toSource());
			process_url		    = true;
			var tab			    = gBrowser.addTab(decodeURIComponent(url.url));
			var new_tab 		= gBrowser.getBrowserForTab(tab);
			new_tab.input_data	= url;
			//if(url.mark_first != true){
		        //		tab.style.display 	= 'none';
			//}else
			//	gBrowser.selectedTab	= tab;
			this.add_event(new_tab,tab_ind+1,tab_ind, url);
			this.tab_count += 1;
		}
		if(true == process_url)
			TASApp.gbl.extd_flg	= true;
		
	},
    load_new_url:function(new_tab_flag, prev_tab){
	console.log('START LOAD');
        var url		=  this.get_url_with_no_click();
		if(!url){
             return;
        }
		utils.Logger.push("data "+url.toSource());
	    TASApp.gbl.extd_flg	= true;
        if (new_tab_flag){
            var tab_ind         = prev_tab.getAttribute('tab_index')
            try{prev_tab.contentWindow.close()}catch(e){}    
		    var tab			    = gBrowser.addTab(decodeURIComponent(url.url));
	    	var new_tab 		= gBrowser.getBrowserForTab(tab);
		    new_tab.input_data	= url;
	  	    this.add_event(new_tab, tab_ind+1,tab_ind, url);
			gBrowser.selectedTab	= tab;
        }
        else{
		    prev_tab.input_data	= url;
            prev_tab.contentWindow.location.href	= decodeURIComponent(url.url);
        }
    },
	get_url_with_no_click:function(){	
		return this.tab_urls.shift();
	},
	/*
	*
	* Date         : Aug 27, 2013
 	* Brief        : Add url index and tab index attribute to tab object
	* Parameters   :
	* 		@param{[Object [XUL Element]]}	new_tab	=> Tab
	* 		@param{Number}			ind	=> URL index
	* 		@param{Number}			pos	=> Tab index
	*/
	add_event:function(new_tab,ind,pos){
		new_tab.setAttribute("tab_index",ind);
		new_tab.setAttribute("tab_click","click");
		new_tab.setAttribute("tab_position",pos);
	},
	/*
	*
	* Date         : Aug 27, 2013
 	* Brief        : Create New extraction object with tab, contentWindow, contentDocument and details of url.And Start extraction process
	* Parameters   :
	* 		@param{[Object [XUL Element]]}	new_tab	=> Tab
	*/
	tab_onload:function(tab){
		var extraction	= new webExtract({},tab.contentDocument, tab.contentWindow,tab, this);
		var data	= tab.input_data
		if(data){
			//try{
				extraction.data		= data;
				tab.extract_data	= extraction;
				extraction.start();
			//}catch(e){extraction.done('Error '+e, extraction);}
		}else
			extraction.done('empty data', extraction);
	},
	/*
	*
	* Date         : Aug 27, 2013
 	* Brief        : Add progress listener to tabs 
	* Parameters   :
	* 		@param{String}	'rm' to remove progress listener
	*/
	add_progress_listener:function(){
		if(arguments[0] == "rm")
                	gBrowser.removeTabsProgressListener(eventLisiner.tab_listener);
		else{
                	gBrowser.removeTabsProgressListener(eventLisiner.tab_listener);
                	gBrowser.addTabsProgressListener(eventLisiner.tab_listener);
		}
        },      
	set_timeout:function(tabObj, request, aStatus){
		tabObj.setAttribute("tab_retry", 0);
		try{clearTimeout(Number(tabObj.getAttribute("timer")))}catch(e){}
		try{tabObj.setAttribute("timer",setTimeout(function(){exports.Browser.reset_timer(tabObj, request, aStatus);},exports.Browser.timeout*60000));}catch(e){}
	},
	reset_timer:function(tab, request, aStatus){
		utils.Logger.push("reset timer : Tab index ==== "+tab.hasAttribute("tab_index")+' === '+tab.contentWindow.location.href+" === "+tab.getAttribute("retry"));
		components.utils.reportError("reset timer : Tab index ==== "+tab.hasAttribute("tab_index")+' === '+tab.contentWindow.location.href+" === "+tab.getAttribute("retry"));
		if(tab.hasAttribute("tab_index")){
            try{request.cancel(aStatus);tab.contentWindow.window.stop();}catch(e){components.utils.reportError("Error : Cancel request "+e);}
			exports.Browser.set_timeout(tab, request, aStatus);
            this.tab_onload(tab);
        }else if(Number(tab.getAttribute("tab_retry")) == 1){
			var extraction	= new url_Extract({},tab.contentDocument, tab.contentWindow,tab);
			extraction.done('', extraction);
		}else {
			tab.setAttribute("tab_retry", 1);
			tab.contentWindow.location.href	= tab.contentWindow.location.href;
		}
		
	},
	/*
	*
	* Date         : Aug 27, 2013
 	* Brief        : Return tab XUL element for given document
	* Parameters   :
	* 		@param{document}	doc	=> content document
	*
	*/
        tab_from_doc:function(doc) {
                var no = gBrowser.getBrowserIndexForDocument(doc);
                return gBrowser.tabContainer.childNodes[no];
        },
	/*
	*
	* Date         : Aug 27, 2013
 	* Brief        : Read data to fire click event on document.If the click is success, then start extraction process
	* Parameters   :
	* 		@param{Object}	extraction_obj	=> Instance of  url_Extraction class
	*
	*/
	execute_cgi:function(args,func, msg){
		exports.Browser.cgi_stack.push({func:func, arg:args});
		this.run_cgi();
	},
	run_cgi:function(){
		if(!(exports.Browser.cgi_stack.length != 0 && this.cgi_progress_count <= 6))
			return;
		this.cgi_progress_count	+= 1;
		var cgi	= exports.Browser.cgi_stack.shift();
		try{cgi.func(cgi.arg);}catch(e){components.utils.reportError("Run CGI Error "+e);utils.Log("CGI Error : "+e);}
		this.cgi_progress_count	-= 1;
		for(var ind = 0, len = 6 - this.cgi_progress_count;ind < len;ind++)
			this.run_cgi();
		
	},
	stop:function(){
		this.tab_urls	= [];
	},
    	start_extract_urls:function(urls){
		exports.Browser.tab_urls	        = urls.slice(0);
		exports.Browser.tab_urls_count      = exports.Browser.tab_urls.length;
		TASApp.gbl.extd_urls_cnt    = exports.Browser.tab_urls.length;
        	set_extd_load_progress();
		exports.Browser.init();
    },
	window_count:function(){
		var enumerator = wm.getEnumerator("navigator:browser");
		var count	= 0;
		while (enumerator.hasMoreElements()) {
  			var property = enumerator.getNext();
			count	+= 1;
		}
		return count;
	}

}
function print_id(aSubject){
	var util = aSubject.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
	var windowID = util.outerWindowID;
	return windowID;
}
function extract_from_new_window(tab, win){
	try{
		var DOMWindow	= tab.contentWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		var opener	= DOMWindow.document.defaultView.top.opener;
	}catch(e){
		components.utils.reportError("Error new window "+e);
		tab.contentWindow.close();
		return;
	}
	if(opener){
		var no 		= gBrowser.getBrowserIndexForDocument(opener.document);
		var parent_tab  = gBrowser.getBrowserForTab(gBrowser.tabContainer.childNodes[no]);
		if(parent_tab.hasAttribute("tab_index")){
			parent_tab.setAttribute("popup_window_id", print_id(win));
			try{clearTimeout( parent_tab.click_timeout)}catch(e){}
			parent_tab.extract_data.window	= DOMWindow;
			parent_tab.extract_data.doc	= DOMWindow.document;
			parent_tab.extract_data.data.new_window = 'Y';
			exports.Browser.extension_type['popup']	= 'Y';
			parent_tab.extract_data.extract_data();
	    	DOMWindow.close();
		}
	}else
		tab.contentWindow.close();
}
function disp_details(aSubject, aTopic, aData){
	var win 	= aSubject.window;
	win 		= win.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
	if(win.gBrowser){
		var tab		= win.gBrowser.getBrowserForTab(win.gBrowser.selectedTab);
		extract_from_new_window(tab, win);
	}	
}
exports.windowObserver = {
	observe:function(aSubject, aTopic, aData) {
		if(aTopic == "domwindowopened")
			setTimeout(function(){disp_details(aSubject, aTopic, aData);}, 3000);
	}
};
