/*
 * Author       : Angamuthu G
 * Date         : Jul 31, 2013
 * Brief        : Get all the Event Listener and an array of event targets indicating all the doms that will receive the same events that are delivered to the specified dom from dom 
 */
const {components, Cc, Ci} = require("chrome");
var Cil         = components.interfaces.nsIWebProgressListener;
const STATE_START       = Cil.STATE_START;
const STATE_STOP        = Cil.STATE_STOP;
const STATE_IS_REQUEST  = Cil.STATE_IS_REQUEST;
const STATE_IS_DOCUMENT = Cil.STATE_IS_DOCUMENT;
const STATE_IS_WINDOW   = Cil.STATE_IS_WINDOW;
const STATE_IS_NETWORK  = Cil.STATE_IS_NETWORK;
const STATE_REDIRECTING = Cil.STATE_REDIRECTING;
var utils = require("./utils")
var { setTimeout, clearTimeout } = require("sdk/timers");
var tab_utils = require("sdk/window/utils");
var gBrowser = tab_utils.getMostRecentBrowserWindow().gBrowser;

exports.console_event_listener = console_event_listener;
exports.reset_listener_callback_functions = reset_listener_callback_functions;
exports.process_extd_load_end = process_extd_load_end;
exports.process_extd_load_start = process_extd_load_start;
exports.set_extd_load_progress = set_extd_load_progress;
exports.aEventListener      = {
                dom:null,
                /*
                 * Author       : Angamuthu G
                 * Date         : Jul 31, 2013
                 * Brief        : Get all the Event Listeners for given dom
                 * Parameters   :
                 *                      @param{Object}  dom             => HTML element
                 */
                get_event_listener:function(dom){
                        this.dom        = dom;
                        var events      = new Array();
                        var listenerService = components.classes["@mozilla.org/eventlistenerservice;1"].getService(components.interfaces.nsIEventListenerService);
                        var infos = listenerService.getListenerInfoFor(dom, {});
                        for ( var index = 0, events_len = infos.length; index < events_len; index++) {
                                var info = infos[index].QueryInterface(components.interfaces.nsIEventListenerInfo);
                                //Services.console.logStringMessage("target : "+info.toSource());
                                events.push({event:info.type});
                        }       
                        return events;
                },              
                /*
                 * Author       : Angamuthu G
                 * Date         : Jul 31, 2013
                 * Brief        : Returns an array of event targets indicating all the targets that will receive the same events that are delivered to the specified target   
                 * Parameters   :
                 *                      @param{Object}  dom             => HTML element
                 */

                get_event_listener_targets:function(dom){
                        var eventListenerService = components.classes["@mozilla.org/eventlistenerservice;1"].getService(components.interfaces.nsIEventListenerService);
                        var result = eventListenerService.getEventTargetChainFor(dom,{});
                        for(var index =0,len = result.length; index < len; index++) {
                                // Services.console.logStringMessage("target : "+result[index]);
                        }
			return result;
                },
                /*
                 * Author       : Angamuthu G
                 * Date         : Jul 31, 2013

                 * Brief        : Returns an array of nsIEventListenerInfo objects describing everyone listening to the specified event target. If aEventTarget doesn't have any listeners, this returns null
                 * Parameters   :
                 *                      @param{Object}  dom             => HTML element
                 */

                get_event_listener_info:function(dom){
			return []
                        var eventListenerService = components.classes["@mozilla.org/eventlistenerservice;1"].getService(components.interfaces.nsIEventListenerService);
                        var result 	= eventListenerService.getListenerInfoFor(dom,{});
			var events	= new Array();
                        for(var index =0,len = result.length; index < len; index++) {
                                //if (eventListenerService.hasListenersFor(dom, result[index].type)){
                                    //Services.console.logStringMessage("index : "+dom.getAttribute('customindex')+" target : "+result[index].type+"==="+result[index].allowsUntrusted+"===="+result[index].capturing+"===="+result[index].inSystemEventGroup);
                                //}
				events.push(result[index].type);
                        }
			return events;
                },

                /*
                 * Author       : Angamuthu G
                 * Date         : Jul 31, 2013
                 * Brief        : Returns true if a event target has any listener for the given type
                 * Parameters   :
                 *                      @param{Object}  dom             => HTML element
                 *                      @param{String}  type            => Event type
                 */
                chk_listener_available:function(dom, type){
                        var eventListenerService = components.classes["@mozilla.org/eventlistenerservice;1"].getService(components.interfaces.nsIEventListenerService);
                        return eventListenerService.hasListenersFor(dom, type);
                },
                /*
                 * Author       : Angamuthu G
                 * Date         : Jul 31, 2013
                 * Brief        : Fire Mouse events
                 * Parameters   :
                 *                      @param{Object}  dom             => HTML element
                 *                      @param{Object}  eType           => Event type 
                 */
		fire_event:function(dom, type){
			var event_obj = content.document.createEvent("MouseEvent");
			switch(type){
				case "mouseover": case "mouseenter":  case "mousemove":
					event_obj.initEvent("mouseover", true, true);
					dom.dispatchEvent(event_obj);
					event_obj.initEvent("mousemove", true, true);
					dom.dispatchEvent(event_obj);
					event_obj.initEvent("mouseenter", true, true);
					dom.dispatchEvent(event_obj);
					return true;
					break;
				case "mouseout": case "mouseleave":
					event_obj.initEvent("mouseout", true, true);
					dom.dispatchEvent(event_obj);
					event_obj.initEvent("mouseleave", true, true);
					dom.dispatchEvent(event_obj);
					return true;
					break;
				default:
					event_obj.initEvent(type, true, true);
					return dom.dispatchEvent(event_obj);
					break;
			}
			return false;
		},
        fireClick:function(node, type){
            var doc = content.document;
            if ( doc.createEvent ) {
                var evt = doc.createEvent('MouseEvent');
                evt.initEvent('click', true, true);
                node.dispatchEvent(evt);    
            } else if( doc.createEventObject ) {
                node.fireEvent('onclick') ; 
            } else if (typeof node.onclick == 'function' ) {
                node.onclick(); 
            }else{
                node.click();
            }
        },
                /*
                 * Author       : Angamuthu G
                 * Date         : Jul 31, 2013
                 * Brief        : Set pseudo calss(:active,:hover,:visited) CSS style
                 * Parameters   :
                 *                      @param{Object}  dom             => HTML element
                 *                      @param{Object}  pseuso_class    => stat
                 */
		set_pseudo_class:function(dom, stat){
			 var inIDOMUtils = components.classes["@mozilla.org/inspector/dom-utils;1"].getService(components.interfaces.inIDOMUtils);
                         inIDOMUtils.setContentState(dom, stat);
                                        
		}
}
/*
 * Author       : Angamuthu G
 * Date         : Jul 31, 2013
 * Brief        : Error Console listener 
 */
function console_event_listener(){
	var Cc = components.classes;
	var Ci = components.interfaces;
	var Cu = components.utils;
	Cu.import("resource://gre/modules/Services.jsm");
	Cu.import("resource://gre/modules/XPCOMUtils.jsm");
	var consoleList = {
	    observe:function( aMessage ){
			//if(/^\[\s*JavaScript Error\:/.test(aMessage.message))
			//	alert(aMessage.message);
	        	//dump("observed "+aMessage.message);
    		},
    		QueryInterface:XPCOMUtils.generateQI([Ci.nsIConsoleListener,Ci.nsIScriptError])
	};

	Services.console.registerListener(consoleList); 
}
/*
 * Start console listener
 * */
console_event_listener();
function reset_listener_callback_functions(){
	browser_page_load_start	= function(){}
	browser_page_load_end	= function(){}
	browser_page_location_change	= function(){}
}
reset_listener_callback_functions();
exports.tab_listener  = {
	onStateChange: function(aBrowser,aWebProgress, aRequest, aFlag, aStatus) {
                utils.Logger.push("Redirect Flag : "+(aFlag & STATE_REDIRECTING));
		if (aFlag & STATE_IS_NETWORK && aWebProgress["historyID"]) {
			if (aFlag & STATE_START && aFlag & STATE_IS_REQUEST && aFlag & STATE_IS_DOCUMENT) {
        			utils.Logger.push("Page Load start == "+aRequest["name"]+"===="+aStatus);
                		browser_page_load_start(aBrowser,aWebProgress, aRequest, aFlag, aStatus);
			}else if (aFlag & STATE_STOP &&aFlag & STATE_IS_WINDOW && aStatus == 0) {
			        //var httpChannel = aRequest.QueryInterface(components.interfaces.nsIHttpChannel);
				utils.Logger.push("Page Load end == "+aRequest["name"]);
				content		= aWebProgress.DOMWindow.top.window;
                		browser_page_load_end(aBrowser,aWebProgress, aRequest, aFlag, aStatus);
            		}
			/*else if (aFlag & STATE_REDIRECTING){
				var httpChannel = aRequest.QueryInterface(Ci.nsIHttpChannel);
				utils.Logger.push("Redirect : "+aRequest["name"]+"===="+httpChannel.responseStatus);
			}*/
		}
		/*if (aRequest instanceof Ci.nsIHttpChannel) {
			var httpChannel = aRequest.QueryInterface(Ci.nsIHttpChannel);
			utils.Logger.push("Redirect : "+aRequest["name"]+"===="+httpChannel.responseStatus);
        	}*/
	},
    	onLocationChange: function(aBrowser, aWebProgress, aRequest, aURI, aFlag) {
    		browser_page_location_change(aBrowser, aWebProgress, aRequest, aURI, aFlag);
    	},
}
function process_extd_location_changed(aBrowser, aWebProgress, aRequest, aURI, aFlag){
	//var httpChannel = aRequest.QueryInterface(components.interfaces.nsIHttpChannel);
	//utils.Logger.push("Page Location Changed ===="+aRequest['name']+"===="+aURI['asciiSpec']+"==="+httpChannel.responseStatus+"==="+aFlag);
}

function process_extd_load_end(aBrowser,aWebProgress, aRequest, aFlag, aStatus){
		var browser  = require("./browser");
		var Browser = browser.Browser;
        	utils.Logger.push("YEEPage Load end == "+aRequest["name"]);
		var tabObj      = gBrowser.getBrowserForTab(Browser.tab_from_doc(aWebProgress.DOMWindow.top.document));
                if(tabObj.getAttribute("tab_index")){
		    utils.Logger.push("tab_index : "+tabObj.getAttribute("tab_index"));
		    tabObj.current_url = aRequest["name"];
		    let httpChannel = aRequest.QueryInterface(Ci.nsIHttpChannel);
		    var contentType = "";
                    try { contentType = httpChannel.contentType; } catch(ex) {}
		    tabObj.contentType = contentType;
		    var httpResponse = "";
                    try { httpResponse = httpChannel.responseStatus; } catch(ex) {}
                    tabObj.httpResponse = httpResponse;
		    Browser.set_timeout(tabObj, aRequest, aStatus);
		   //Browser.tab_onload(tabObj);
		    setTimeout(function(){Browser.tab_onload(tabObj);}, Browser.extraction_start_delay);
		}else if(!(tabObj.hasAttribute("tab_index") && tabObj.getAttribute("tab_position")))
		    browser.extract_from_new_window(tabObj, tabObj.contentWindow);
}
function process_extd_load_start(aBrowser,aWebProgress, aRequest, aFlag, aStatus){
	var Browser  = require("./browser").Browser;
        var tab_new     = Browser.tab_from_doc(aWebProgress.DOMWindow.top.document);
        var tabObj      = gBrowser.getBrowserForTab(tab_new);
        var opener      = aWebProgress.DOMWindow.top.document.defaultView.top.opener;
        utils.Logger.push("Page Load start == "+aRequest["name"]+" === "+ opener+aWebProgress.DOMWindow.top.window.location.href);
        if(opener){
                var no          = gBrowser.getBrowserIndexForDocument(opener.document);
                var parent_tab  = gBrowser.getBrowserForTab(gBrowser.tabContainer.childNodes[no]);
                if(parent_tab.hasAttribute("tab_index")){
                        parent_tab.setAttribute("popup_window_id", "Y");
                        try{clearTimeout(Number(parent_tab.click_timeout))}catch(e){}
                        try{clearTimeout(Number(parent_tab.getAttribute("load_timer")))}catch(e){}
                }
        }
        try{clearTimeout(Number(tabObj.click_timeout))}catch(e){}
        try{clearTimeout(Number(tabObj.getAttribute("load_timer")))}catch(e){}
        Browser.set_timeout(tabObj, aRequest, aStatus);
}
function set_extd_load_progress(){
	reset_listener_callback_functions();
	browser_page_load_start	= process_extd_load_start;
	browser_page_load_end	= process_extd_load_end;
	browser_page_location_change	= process_extd_location_changed
}

exports.DOMObserver = {
    observer : null,
    options : {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true
    },
    initMutationObserver:function(doc, wnd){
        var MutationObserver = wnd.MutationObserver || wnd.WebKitMutationObserver || wnd.MozMutationObserver;
        this.observer = new MutationObserver(this.isDOMChanged);
    },
    startObserver:function(target){
        if (this.observer){
            this.observer.observe(target, this.options);
        }
        return false;
    },
    stopObserver:function(){
        if (this.observer){
            this.observer.disconnect();
            this.observer.takeRecords();
        }
        return false;
    },
    isDOMChanged : function(mutations) {
        var status_info = {};
        status_info.isChildListChanged = false;
        status_info.isAttributeChanged = false;
        status_info.isCharacterDataChanged = false;
        status_info.isChange = false;
        mutations.forEach(function(mutation) {
            if (mutation.type == 'childList'){
                status_info.isChildListChanged = true;
                status_info.isChange = true;
            }
            else if (mutation.type == 'attributes'){
                status_info.isAttributeChanged = true;
                status_info.isChange = true;
            }
            else if (mutation.type == 'characterData'){
                status_info.isCharacterDataChanged = true;
                status_info.isChange = true;
            }
            console.log("type : "+mutation.type);
        });
        this.disconnect();
        this.takeRecords();
        doneMutationObserver(status_info);
        return false;
    }
};

var doneMutationObserver = function(){} 

var tEventManager      = {
    getLinkType:function(node){
        if (!this.isHrefLinkNode(node)){
            return 0;        
        }
        if (this.isHrefAbsoluteLink(node)){
            return 1;        
        }
        if (this.isHrefAnchorLink(node)){
            return 2;        
        }
        if (this.isHrefRelativeLink(node)){
            return 3;        
        }
        if (this.isHrefVoidLink(node)){
            return 4;        
        }
        if (this.isHrefJavascriptLink(node)){
            return 5;        
        }
        if (this.isHrefMailLink(node)){
            return 6;        
        }
        if (this.isHrefImageLink(node)){
            return 7;        
        }
        return 0;
    },
    isHrefLinkNode:function(node){
        if(node.tagName.toLowerCase() != 'a' && node.tagName.toLowerCase() != 'area')
            return false;
        return true;
    },
    isValidHrefLinkNode:function(node){
        if (this.isHrefLinkNode(node)){
            var target  = node.getAttribute("target");
            var href    = node.getAttribute("href");
            if(node.getAttribute('iframe') == 'no' && href && !(target && '_blank' != target) && !(/^\s*javascript\s*\:/.test(href) || /^\s*$/.test(href)))
                return true;
            if (href && (node.protocol || node.host || node.search || node.pathname || node.hash)){
                return true;
            }
            return false;
        }
    },
    isHrefJavascriptLink:function(node){ 
        if (this.isHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            if (/^\s*javascript\s*\:/.test(href)){
                return true;
            }
        }
        return false;
    },
    isHrefMailLink:function(node){    
        if (this.isHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            if (/^\s*mailto\s*\:/.test(href)){
                return true;
            }   
        }   
        return false;
    },  
    isHrefImageLink:function(node){    
        if (this.isHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            if (/^\s*data\s*:\s*image\/[^;]{2,9};/i.test(href)){
                return true;
            }   
        }   
        return false;
    }, 
    isHrefVoidLink:function(node){ 
        if (this.isHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            if (/^\s*javascript\s*\:void\(0\)/.test(href)){
                return true;
            }
        }
        return false;
    },
    isHrefAbsoluteLink:function(node){ 
        if (this.isValidHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            //if (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(href))
            if (/^(https?|file|ftps?):/i.test(href))
            { 
                return true;
            }
        }
        return false;
    },
    isHrefRelativeLink:function(node){ 
        if (this.isValidHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            var ahref    = node.href;
            var path = node.pathname;
            path = (path.charAt(0) == "/") ? path.substring(1, path.length) : path;
            if ((href != ahref) && ((href.substring(0,2) == "//") || (href.charAt(0) == "/") || (href.substring(0,2) == "./") || (href.substring(0,3) == "../"))){
                return true;
            }
            if ((href != ahref) && ((path == href) || (path+node.search+node.hash == href))){
                return true;
            } 
        }
        return false;
        
    },
    isHrefAnchorLink:function(node){ 
        if (this.isValidHrefLinkNode(node)){
            var href    = node.getAttribute("href");
            var ahref    = node.href;
            if ((href != ahref) && (node.hash)){
                return true;
            }
        }
        return false;
    }
};

function watcher(window) {
    window.focus();
    var pref = require("sdk/preferences/service");
    var win             = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
    var opener  = win.document.defaultView.top.opener;
    console.log('>>>>>>>>>>>>>'+opener+'>>>>>>>>>>>.'+win);
    if(opener){
         var no                 = gBrowser.getBrowserIndexForDocument(opener.document);
         var parent_tab  = gBrowser.getBrowserForTab(gBrowser.tabContainer.childNodes[no]);
         if(parent_tab.hasAttribute("tab_index")){
                parent_tab.input_data.page_type = 'DOWNLOAD';
                //var data        = parent_tab.input_data
                //var pathObject = utils.init_url_path(""+data.doc_id, data.opath, data.defaultpath)
                //pref.set('browser.download.dir', pathObject.download);
         }
    }
    //pref.set('browser.download.folderList', 2);
    //pref.set('browser.download.manager.showWhenStarting', false)
    //pref.set('browser.download.manager.useWindow', false);
    //pref.set('browser.helperApps.alwaysAsk.force', false);
    //pref.set('pdfjs.disabled', true);
    console.log('++++++++++++'+window.document.location);
 
    if(window.document.location == "chrome://global/content/commonDialog.xul"){
	try {
		var cancelButton = window.document.documentElement.getButton("cancel");
                cancelButton.click();
        }catch(ex) {console.log('ERROR :'+ex)}

    }
 
    if (window.document.location == "chrome://mozapps/content/downloads/unknownContentType.xul"){
        try {
                //var elm = window.document.getElementById('save')
                //elm.click();
                //var saveButton = window.document.documentElement.getButton("accept");
                var saveButton = window.document.documentElement.getButton("cancel");
                saveButton.click();
        }catch(ex) {console.log('ERROR :'+ex)}
    }
    //var domWindowUtils = window.QueryInterface(components.interfaces.nsIInterfaceRequestor).getInterface(components.interfaces.nsIDOMWindowUtils);    
    //var tt = domWindowUtils.sendKeyEvent('keypress', 13, 0, false);
}
function runOnLoad(window) {
    window.addEventListener("load", function runOnce() {
        window.removeEventListener("load", runOnce, false);
        watcher(window);
    }, false);
}

function MyWindowObserver() {
  this.observe=function(aSubject, aTopic, aData) {
        console.log("window event: " + aTopic)
        if (aTopic == 'domwindowopened'){
           runOnLoad(aSubject)
        }
        else if (aTopic == 'domwindowclosed'){
        }
  }
}
var ww = components.classes["@mozilla.org/embedcomp/window-watcher;1"]
              .getService(components.interfaces.nsIWindowWatcher);
ww.registerNotification(new MyWindowObserver())
