exports.webExtract = webExtract;
var utils = require("./utils")
var TASApp = require("./server_config").TASApp;
const {components, Cc, Ci} = require("chrome");
var tab_utils = require("sdk/window/utils");
var gBrowser = tab_utils.getMostRecentBrowserWindow().gBrowser;
var get_dom_tree = require("./extract_dom_elements").get_dom_tree;

function webExtract(data, doc, awindow,tab, browser){
    	this.browser        	= browser;
	this.data	        = data;
	this.doc	        = doc;
	this.window	        = awindow;
	this.tab	        = tab;
	this.recorded_data  = new Array();
}
webExtract.prototype	= {
    urlStatus:function(){
	var url = decodeURIComponent(this.data.url);
        //var url         = this.window.location.href;
	const {XMLHttpRequest} = require("sdk/net/xhr");
	const httpproto = Cc["@mozilla.org/network/protocol;1?name=http"].
                  getService(Ci.nsIHttpProtocolHandler);
	var http = new XMLHttpRequest();
        http.open('GET', url, false);
        //http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.setRequestHeader('User-Agent', httpproto.userAgent + ' redirectcheck-client');
        http.send();
	return http.status;
    },
    urlTitle:function(){
        return this.doc.title;
    },
    start:function(){
	console.log('START'+JSON.stringify(this.data));
	var currentdate = new Date();
        //var datetime = currentdate.getDate() + "-"+(parseInt(currentdate.getMonth())+1)+ "-" + currentdate.getFullYear() + ":"+ currentdate.getHours() + ":"+ currentdate.getMinutes() + ":" + currentdate.getSeconds();
	var datetime = ('0'+currentdate.getDate()).slice(-2) + "-"+('0'+(parseInt(currentdate.getMonth())+1)).slice(-2)+ "-" + currentdate.getFullYear() + ":"+ ('0'+currentdate.getHours()).slice(-2) + ":"+ ('0'+currentdate.getMinutes()).slice(-2) + ":" + ('0'+currentdate.getSeconds()).slice(-2);
        //var currURL         = encodeURIComponent(this.tab.current_url);
        var content_type = this.tab.contentType;
	this.tab.contentType = '';
	var currURL         = encodeURIComponent(this.window.location.href);
        var loadURL         = this.data.url;
        var ustatus = this.tab.httpResponse;
	var decode_currURL = decodeURIComponent(this.window.location.href);
	var decode_loadURL = decodeURIComponent(this.data.url);
	console.log('++++++++++++++++++++++++++++++++++++'+this.data.page_type+'++++++++++++'+content_type);
	if (this.data.page_type == 'DOWNLOAD' || content_type == 'application/msword' || content_type == 'application/ms-excel' || content_type == 'application/pdf' || content_type == 'application/zip' || content_type == 'application/octet-stream' || content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            response_flag = 'Success';
	}else if (ustatus == 401){
            console.log("Redirect (Login)====="+ustatus);
            response_flag = 'Redirect (Login)';
        }else if (ustatus == 403){
            console.log("Unresolved ====="+ustatus);
            response_flag = 'Unresolved';
        }else{
           //var ustatus = this.urlStatus();
	   console.log("httpresponse>>>"+ustatus);
           var img_path    = TASApp.config.CGI_IP+TASApp.config.JS_DIR+'images/'
           if (ustatus != 200){
               console.log("Fail====="+ustatus);
               response_flag = 'Fail';
           }else{
              if(this.urlTitle().search('Page Not Found') == -1 && this.urlTitle().search('Page not found') == -1 && this.urlTitle().search('page not found') == -1 && this.urlTitle().search('404 Not Found') == -1 && this.urlTitle().search('Page Cannot Be Found - 404') == -1 && this.urlTitle().search('PageNotFound') == -1 && this.urlTitle().search('Page or File Not Found') == -1 && this.urlTitle().search('LexisPSL - Error Page') == -1 && this.urlTitle().search('The National Archives | Error message: Page not found') == -1 && this.urlTitle().search('The requested document does not exist. - EUR-Lex') == -1 && this.urlTitle().search('Sorry, we can&#39;t find that page | 404 | ICAEW') == -1){
                console.log("current url ======="+currURL);
                console.log(" load url ======="+loadURL);
                console.log(" De current url ======="+decode_currURL);
                console.log(" De load url ======="+decode_loadURL);
                console.log(" title ======="+this.urlTitle());
                var response_flag = '';
		var curr_url_s = [loadURL.slice(0, 4), 's', loadURL.slice(4)].join('');
		var load_http = 'http%3A%2F%2F'+loadURL;
		var load_https = 'https%3A%2F%2F'+loadURL;
		//console.log('cuu :'+currURL+'%2F');
		//console.log(' load :'+curr_url_s);
                if(currURL == loadURL){
		    if((this.urlTitle().search('Sign In | LexisNexis') != -1 && this.urlTitle().search('Sign In') != -1) || this.urlTitle().search('Lexis®Library: Sign in') != -1){
		    //if(this.urlTitle().search('Sign In | LexisNexis') != -1 || this.urlTitle().search('Lexis®Library: Sign in') != -1){
                    	response_flag = 'Login (Lexis)';
                        console.log("LRedirect========"+datetime);
                    }else{
                    	response_flag = 'Success';
                    	console.log("Success ====="+datetime);
                    	console.log("Response====="+response_flag);
		    }
                }else if(curr_url_s == currURL || curr_url_s == currURL+'%2F'){
                    response_flag = 'Success';
                    console.log("Success====="+datetime);
                    console.log("Response====="+response_flag);
		}else if(load_http == currURL || load_http+'%2F' == currURL || load_https == currURL){
                    response_flag = 'Success';
                    console.log("Success====="+datetime);
                    console.log("Response====="+response_flag);
                }else if(decode_currURL == decode_loadURL){
                    response_flag = 'Success';
                    console.log("Success====="+datetime);
                    console.log("Response====="+response_flag);
                }else{ 
		    if(currURL == 'about%3Ablank'){
			response_flag = 'Success';
                        console.log("Success========"+datetime);
		    }else{
                    	var www_loadURL = [loadURL.slice(0, 13), 'www.', loadURL.slice(13)].join('');
                    	var www_currURL = [currURL.slice(0, 13), 'www.', currURL.slice(13)].join('');
                    	console.log('new url'+www_loadURL);
                    	console.log('new url'+www_currURL);
                    	if(currURL == www_loadURL || currURL == loadURL+'%2F' || currURL == www_loadURL+'%2F' || www_currURL == loadURL){
                        	response_flag = 'Success';
                        	console.log("Success========"+datetime);
                    	}else{
				if((this.urlTitle().search('Sign In | LexisNexis') != -1 && this.urlTitle().search('Sign In') != -1) || this.urlTitle().search('Lexis®Library: Sign in') != -1){
                        	//if(this.urlTitle().search('Sign In | LexisNexis') != -1 || this.urlTitle().search('Lexis®Library: Sign in') != -1){
                            		response_flag = 'Login (Lexis)';
                            		console.log("LRedirect========"+datetime);
                        	}else{
                            		response_flag = 'Redirect (other)';
			    		console.log("Redirect========"+datetime);
                        	}
                    	}
		    }
                }
              }else{
                response_flag = 'Fail';
                console.log("Response flag========"+response_flag);
             }
           }
	}
	//var table_name = system.staticArgs.table_name;
        json_data = {'response':response_flag,'url_id':this.data.doc_id,'datetime':datetime,'new_url':currURL,'table_name':this.data.table_name}
        var cgi = TASApp.config.IP+TASApp.config.CGI_DIR + 'change_detection/cgi_update_url_response_new.py?input_str='+JSON.stringify(json_data);
        utils.Logger.push("Update All urls === "+cgi);
        //send_ajax_request(cgi, null, 1, "", "GET", true);
	this.send_ajax_request_extract_new(cgi, null, this.done_extraction, "GET", true, this.not_done_extraction);
        //Id('row_'+this.data.doc_id).innerHTML = '<img src="'+img_path + 'tick.png" width="17" height="17" />';

	/*
	var currentdate = new Date();
        var datetime = currentdate.getDate() + "-"+(parseInt(currentdate.getMonth())+1)+ "-" + currentdate.getFullYear() + ":"+ currentdate.getHours() + ":"+ currentdate.getMinutes() + ":" + currentdate.getSeconds();
        var ustatus = this.urlStatus();
        console.log("Status====="+ustatus);
        var currURL         = encodeURIComponent(this.window.location.href);
        var loadURL         = this.data.url;
	var response_flag = '';
        if (ustatus == 200){
            if(this.urlTitle().search('Page Not Found') != -1 || this.urlTitle().search('Page not found') != -1 || this.urlTitle().search('page not found') != -1){
		console.log("current url ======="+currURL);
                console.log(" load url ======="+loadURL);
                console.log(" title ======="+this.urlTitle());
		response_flag = 'Fail';
	    }else{
		response_flag = 'Success';
                console.log("Success====="+datetime);
	    }
        }else if (ustatus >= 300 && ustatus < 400){
            response_flag = 'Redirect';
            console.log("Redirect========"+datetime);
        }else{
            console.log("Fail====="+ustatus);
            response_flag = 'Fail';
        }
        console.log("Response flag========"+response_flag);
        json_data = {'response':response_flag,'url_id':this.data.doc_id,'datetime':datetime, 'new_url':currURL}
        var cgi = TASApp.config.IP+TASApp.config.CGI_DIR + 'change_detection/cgi_update_url_response.py?input_str='+JSON.stringify(json_data);
        utils.Logger.push("get All urls === "+cgi);
        this.send_ajax_request_extract_new(cgi, null, this.done_extraction, "GET", true, this.not_done_extraction);
	*/
	return


	console.log('Start Render=='+this.data.action_type+"==="+ustatus);
        if (ustatus != 200){
		return;
        }
        if (this.data.action_type == 'link'){
            this.start_extraction();
        }
        else{
            this.start_fire_event_action(this);
        }
    },
    start_fire_event_action:function(extract){
        var node = extract.find_target_element_for_action(extract);       
        extract.fire_event_action(node, extract);
    },
    find_target_element_for_action:function(extract){
        var node = null;
        return node;
    },
    fire_event_action:function(node, extract){
        if (node){
            aEventListener.fire_event(node, extract.data.action_type);
        }
    },
    start_extraction:function(){
        utils.Logger.push("START :" +JSON.stringify(this.data));
        if("CD" == TASApp.config.PROC){
		    this.doc_insert_process(this);
        }else{
	        this.extract_web_data(this.data.doc_id, this);
        }
    },
    save_dom_html_data:function(text, extract){
	var vservice_path 	= TASApp.config.IP + TASApp.config.CGI_DIR + 'save_dom_data/cgi_save_body_outer_html_dict.py?';
	var vtt 		= 'doc_id=' +extract.data.doc_id+ '&dom_json=' + encodeURIComponent(extract.html.outerHTML)+"&date_dir="+TASApp.gbl.date_dir;
	utils.Logger.push("DATA URL : "+vservice_path + vtt);
        extract.send_ajax_request_extract_new(vservice_path, vtt, extract.done_extraction, "POST", true, extract.not_done_extraction);
    },
    save_dom_image_data:function(img_data, extract){
        var kdataURL 		= encodeURIComponent(img_data);
        var kcrop_id 		= "page";
        var strURL 	    	= TASApp.config.IMG_IP+TASApp.config.PHP_DIR+'sj.php?';
        var vquery 	    	= "doc_id="+extract.data.doc_id+"&crop_id="+kcrop_id+"&user_id="+extract.data.user_id+"&date_dir="+TASApp.gbl.date_dir+"&MyData="+kdataURL+"&stage_id="+TASApp.gbl.active_stage_id;
	console.log("========== : "+strURL+vquery);
        extract.send_ajax_request_extract_new(strURL, vquery, extract.save_dom_html_data, "POST", true, extract.not_done_extraction);
    },
    extract_web_data:function(new_doc_id, extract){
        utils.Logger.push('DATA : '+new_doc_id +'===='+JSON.stringify(extract.data));
		if(!(/^\d+$/.test(new_doc_id))){
            return;
        }
       	extract.data.new_doc_id = new_doc_id;
		extract.data.parent_document_id	= extract.data.doc_id;
		extract.data.doc_id	= extract.data.new_doc_id;

		utils.Logger.push("url_Extraction Doc Id === "+extract.data.prof_id+" === "+extract.new_doc_id+" === "+new_doc_id);
	    try{extract.doc.body.scrollTop = extract.doc.documentElement.scrollTop = 0;}
        catch(e){components.utils.reportError("url_Extraction Error : "+e);}
	    var page	= extract.get_page_size();
		extract.data.page_size	= page;
        //try{extract.data.on_extract(extract.data)}catch(e){}
        extract.dom_tree   = get_dom_tree(extract.doc.body, 0, extract.doc, 1,extract);
        var img_data 	= extract.create_image_extd(extract.window, extract.doc, 0, 0, page.w, page.h);
        var dom_load_flag = 1
	console.log('img_data : '+img_data);
        if (img_data == null || img_data == 'Done' ){
            dom_load_flag = 0
            extract.save_dom_html_data("", extract);
        }
        else{
            extract.save_dom_image_data(img_data, extract);
        }
	},
    send_ajax_request_extract_new:function(cgi_file, post_data, sucess_callback, request_type, asyn, failure_callback){
        var extract = this;
	const {XMLHttpRequest} = require("sdk/net/xhr");
        var xmlhttp = new XMLHttpRequest();
        //var xmlhttp = (window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState ==4 && xmlhttp.status==200){
                       var text        = xmlhttp.responseText.trim();
                       try{
                                sucess_callback(text.trim(), extract);
                       }catch(e){
                                failure_callback(cgi_file, e, extract);
                       }
                }
                else if(xmlhttp.readyState == 4 && xmlhttp.status != 200){
                       failure_callback(cgi_file, xmlhttp.status, extract);
                }
        }
        xmlhttp.open(request_type,cgi_file,asyn);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(post_data);
    },
    doc_insert_process:function(extract) {
       	extract.data.parent1_doc_id = extract.data.doc_id;
		var page	= extract.get_page_size();
   		var currURL 		= encodeURIComponent(extract.window.location.href);
        utils.Logger.push("current url ==="+ currURL);  
		var query_json		= {user_id: extract.data.user_id, url:currURL, pw:extract.pw, ph : extract.ph, agent_id:extract.data.agent_id, home_url	: encodeURIComponent(TASApp.gbl.home_url), page_type: extract.data.page_type, batch_id	: extract.data.batch_id, project_id : TASApp.gbl.project_id,stage_id : TASApp.gbl.active_stage_id, parent_document_id:extract.data.doc_id, level_id:extract.data.level_id, mgmt_id:TASApp.gbl.mgmt_id, url_id:TASApp.gbl.url_id};
   		var vservice_path 	= TASApp.config.IP+TASApp.config.CGI_DIR + 'document_master_process/cgi_document_process_new.py?input_str=';
   		var strURL = vservice_path+JSON.stringify(query_json);
		utils.Logger.push("doc_insert_process "+strURL+" === "+extract.data.parent1_doc_id+" ==== ");
       	extract.send_ajax_request_extract_new(strURL, null, extract.extract_web_data, "GET", true, extract.not_done_extraction);
	},
    not_done_extraction:function(cgi_file, error_msg, extract){
		utils.Logger.push("ERROR :"+cgi_file+" === "+error_msg+" ==== ");
    },
    get_page_size:function(){
       		this.pw = Math.max(this.doc.documentElement["clientWidth"], this.doc.body["scrollWidth"], this.doc.documentElement["scrollWidth"], this.doc.body["offsetWidth"], this.doc.documentElement["offsetWidth"]);
       		this.ph = Math.max(this.doc.documentElement["clientHeight"], this.doc.body["scrollHeight"], this.doc.documentElement["scrollHeight"], this.doc.body["offsetHeight"], this.doc.documentElement["offsetHeight"]);
		return {w:this.pw, h:this.ph};
	},
    create_image_extd:function(win, doc, x, y, w, h){
        extract = this;
	    extract.data.img_count	= 1;
        if(h <= this.browser.canvas_max_height){
            return this.create_image_data_from_window(win, doc, x, y, w, h);
        }else{
            var count	= Math.ceil(h/this.browser.canvas_max_height);
            extract.data.img_count	= count;
            var height	= h;
            for(var ind = 0; ind < count;ind++){
                var img_data	= this.create_image_data_from_window(win, doc, x, (this.browser.canvas_max_height*ind), w, (height > this.browser.canvas_max_height)?this.browser.canvas_max_height:height);
                height	= height - this.browser.canvas_max_height;
                this.store_slice_img_data(img_data, ind + 1);
            }
            return 'Done';
        }
    },
    create_image_data_from_window:function(win, doc, x, y, w, h){
        var canvas 		    = doc.createElementNS('http://www.w3.org/1999/xhtml','canvas');
        var canvasW 		= Math.round(w);
        var canvasH 		= Math.round(h);
        canvas.style.width 	= canvasW + "px";
        canvas.style.height = canvasH + "px";
        canvas.width 		= canvasW;
        canvas.height 		= canvasH;
        var img_data 		= null;
        utils.Log("Height === "+(0.75*h) +" == "+(0.5*h)+" ==== "+(0.6*h)+" ==== "+this.browser.canvas_max_height);
        try {
           var ctx 	= canvas.getContext("2d");
           ctx.clearRect(0, 0, canvasW, canvasH);
           ctx.save();
           ctx.drawWindow(win, x, y, w, h, "rgb(255,255,255)");
           ctx.restore();
           img_data 	= canvas.toDataURL("image/png") 
        }
        catch(e) 
        { 
               utils.Log('IMG Error: ' + e.message + '\n'); 
        }
        return img_data;
    },
    store_slice_img_data:function(img_data, index){
        extract = this;
        var kdataURL 		= encodeURIComponent(img_data);
        var kcrop_id 		= "//page";
        var strURL 	    	= TASApp.config.IMG_IP+TASApp.config.PHP_DIR+'sj_slice_data.php?';
        var vquery 	    	= "doc_id="+extract.data.doc_id+"&crop_id="+kcrop_id+"&user_id="+extract.data.user_id+"&date_dir="+TASApp.gbl.date_dir+"&MyData="+kdataURL+"&page_id="+index;
        utils.Logger.push(strURL+"\nsave_canvas_data_test === "+vquery);
        utils.send_ajax_request(strURL, vquery, 1, "utils.Log('slice_id '+text)", "POST", false);
    },
    not_done_extraction:function(cgi_file, error_msg, extract){
		utils.Logger.push("ERROR :"+cgi_file+" === "+error_msg+" ==== ");
    },
    done_extraction:function(extraction_status, extract){
	utils.Logger.push("DATA URL extraction done");
	try{extract.clear_timeout()}catch(e){}
	var doc_id = extract.data.doc_id;
	var img_path    = TASApp.config.CGI_IP+TASApp.config.JS_DIR+'images/'
	console.log('DOC--->'+doc_id);
        console.log('LEFT--->'+extract.browser.tab_urls.length+'=========='+extract.browser.tab_count);
	if(extract.browser.tab_urls.length){
        	if(extract.data.mark_first != true){
            		extract.browser.load_new_url(false, extract.tab);
		}else{
	    		extract.browser.tab_count -= 1;
            	}
        }else{
		     	//if(gBrowser.tabContainer.childNodes.length > 1)// && extract.data.mark_first != true)// && extract.data.pagination != true)
			try{extract.tab.contentWindow.close()}catch(e){}
		     	extract.browser.tab_count -= 1;
        		console.log('TAB LEFT--->'+extract.browser.tab_count);
		     	if (extract.browser.tab_count <= 0){
				    var eventLisiner = require('./event_listener_service')
				    eventLisiner.reset_listener_callback_functions();
		     		    //try{this.data.on_complete(this.data, 'all',this.dom_tree_json)}catch(e){}
				    TASApp.gbl.extd_flg	= false;
				    var system = require("sdk/system");
				    system.exit();
		     	}
        }
    }

}
