exports.create_table = create_table;
exports.create_row_and_cols = create_row_and_cols;
exports.createDOM = createDOM;
exports.setAttr = setAttr;
exports.send_ajax_request = send_ajax_request;
exports.Id = Id;
exports.disp_none = disp_none;
exports.disp_block = disp_block;
exports.Log = Log;
exports.dump_json_data = dump_json_data;
exports.remove_node = remove_node;
exports.send_ajax_request_xml = send_ajax_request_xml;
exports.send_ajax_request_args = send_ajax_request_args;
exports.highlight_texts = highlight_texts;
exports.highlight_text_nodes = highlight_text_nodes;
exports.get_content_window = get_content_window;
exports.get_content_doc = get_content_doc;
exports.get_page_size = get_page_size;
exports.create_log_file = create_log_file;
exports.get_os_name = get_os_name;
exports.set_panel_pos = set_panel_pos;
/****************************************************************************
 * Author	: Angamuthu G
 * Date		: Oct 24, 2013
 * Brief	: Basic javascript library functions
 * **************************************************************************/
/**
 * Description			: Create table HTML DOM Object 
 * @method create_table
 * @param {Object} attr		=> Attributes need to be set to the newly created html element
 * @param {Object} parentElem	=> Parent HTML DOM Element
 * @return tDOM
 */
function create_table(attr, parentElem){
        var tDOM        = createDOM("table",attr,parentElem);
        return tDOM;

}
/**
 * Description		: Create Row and Cells	
 * @method create_row_and_cols
 * @param {Object} 	tDOM		=> Table HTML Object	
 * @param {Object} 	tag_name	=> Cell's tag name TD/TH
 * @param {Object} 	attr		=> Attributes need to be set to the newly created html element
 * @param {Array} 	data		=> Data to be placed in each cell
 * @return row
 */
function create_row_and_cols(tDOM, tag_name, attr,data){
        var row         = createDOM("tr",{},tDOM);
        for(var ind = 0, len =data.length; ind < len; ind++){
		switch(Object.prototype.toString.call(data[ind])){
                        case "[object Object]":
                                if('class' in data[ind] && 'class' in attr){
                                        attr['class']   =  attr['class']+" "+data[ind]['class'];
                                        delete data[ind]['class'];
                                }
                                for(var key in data[ind])
                                        attr[key]       = data[ind][key];
                                break;
                        default:
                                attr["txt"]     = data[ind];
                }
                createDOM(tag_name, attr,row)
        }
        return row;
}

/**
 * Description	: Create HTML DOM Object, set attributes and append to document
 * @method createDOM
 * @param {String} tagName	=> HTML Tag name {div, img...}
 * @param {Object} attributes	=> Attributes need to be set to the newly created html element
 * @param {Object} parentElem	=> Parent HTML DOM Object
 * @return domElem
 */
function createDOM(tagName,attributes,parentElem){
	var domElem	= parentElem.ownerDocument.createElement(tagName);
	setAttr(domElem,attributes);
	parentElem.appendChild(domElem);
	return domElem;
}
/**
 * Description		: Set Attributes to the HTML Element
 * @method setAttr
 * @param {Object} 	elem	=> HTML DOM Element	
 * @param {Object} 	attr	=> Attributes need to be set to the HTML Element
 * @return 
 */
function setAttr(elem, attr){
        if("txt" in attr){
                elem.innerHTML  = attr["txt"];
                delete attr["txt"];
        }
        for(var key in attr )
                elem.setAttribute(key, attr[key]);
}

/**
 * Description
 * @method send_ajax_request
 * @param {} cgi_file
 * @param {} post_data
 * @param {} succ_flag
 * @param {} callback
 * @param {} request_type
 * @param {} asyn
 * @return 
 */
function send_ajax_request(cgi_file, post_data,succ_flag,callback,request_type,asyn){
	var TASApp = require("./server_config").TASApp;
	const {XMLHttpRequest} = require("sdk/net/xhr");
        var xmlhttp = new XMLHttpRequest();
	//(window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
        /**
 	* Description
 	* @method onreadystatechange
 	* @return 
 	*/
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState ==4 && xmlhttp.status==200 && succ_flag == 1) {
                        var text        = xmlhttp.responseText;
                        var xml         = xmlhttp.responseXML;
                        try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){components.utils.reportError("Error JSON.parse "+e);}
                        var callfunc    = eval(callback);
                }
        }
        xmlhttp.open(request_type,cgi_file,asyn);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(post_data);
}
/**
 * Description		: Get HTML Element by given ID
 * @method Id
 * @param {String} 	id	=> ID of the HTML Element to be returned		
 * @return CallExpression
 */
function Id(id, doc){
	if(doc)
        	return doc.getElementById(id);
        return null;
}

function disp_none(elem){
	if(elem)
		elem.style.display	= 'none';
}
function disp_block(elem){
	if(elem)
		elem.style.display	= 'block';
}
function Log(msg){
	//log_services.logStringMessage(msg);
	console.log(msg);
}                    
exports.Logger	= {
	push	:function(msg){
		var tab_pos	= 'global';
		//this[tab_pos].push((new Date())+" ==== "+msg+"\n");
		if(this[tab_pos].length	== 50)
			this.create_local_file(tab_pos);
		Log((new Date())+this[tab_pos].length+" ==== "+msg);
	},
	create_local_file:function(index){
		return;
		try{
			if(this[index].length == 0  ) return;
			var data		= this[index].join("");
			this[index]		= [];
			var c_index 	= null;
			var file		= FileUtils.getDir("Desk", ["Log"], true);
			var time		= new Date();
			var file_name		= time.toDateString().replace(/\s+/g,"_")+"_"+time.getHours()+"_"+time.getMinutes()+"_"+time.getSeconds()+"_"+time.getTime();
			file.append("mgnt_log_"+c_index+"_"+index+"_"+file_name+".txt");
			var ostream		= FileUtils.openSafeFileOutputStream(file);
			var converter 		= Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);  
			converter.charset 	= "UTF-8";  
			var istream 		= converter.convertToInputStream(data);  
			NetUtil.asyncCopy(istream, ostream, function(){}); 
		}catch(e){
			try{this[index] =[];}catch(e){}
		}
	}
			
};
exports.Logger['global']	= new Array();
function dump_json_data(json){
	try{Logger.push("DUMPING JSON === "+JSON.stringify(json, null, '\t'));}catch(e){Logger.push("Error : DUMPING JSON === "+json);}
}
function remove_node(elem){
	try{elem.parentNode.removeChild(elem);}catch(e){}
}
/**
 * Description
 * @method send_ajax_request_xml
 * @param {} cgi_file
 * @param {} post_data
 * @param {} args
 * @param {} callback
 * @param {} request_type
 * @param {} asyn
 * @return 
 */
function send_ajax_request_xml(cgi_file, post_data,args,callback,request_type,asyn, object){
	var TASApp = require("./server_config").TASApp;
	const {XMLHttpRequest} = require("sdk/net/xhr");
        var xmlhttp = new XMLHttpRequest();
        //var xmlhttp = (window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
        /**
 	* Description
 	* @method onreadystatechange
 	* @return 
 	*/
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState ==4 && xmlhttp.status==200 && args) {
                        var text        = xmlhttp.responseText;
                        var xml         = xmlhttp.responseXML;
                        try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){components.utils.reportError("Error JSON.parse "+e);}
			callback(text, xml, args, object);
                }
        }
        xmlhttp.open(request_type,cgi_file,asyn);
        xmlhttp.overrideMimeType('text/xml');//setRequestHeader('Content-Type', 'application/xml');
        xmlhttp.send(post_data);
}

/**
 * Description
 * @method send_ajax_request_args
 * @param {} cgi_file
 * @param {} post_data
 * @param {} args
 * @param {} callback
 * @param {} request_type
 * @param {} asyn
 * @return 
 */
function send_ajax_request_args(cgi_file, post_data,args,callback,request_type,asyn, object){
	var TASApp = require("./server_config").TASApp;
	const {XMLHttpRequest} = require("sdk/net/xhr");
        var xmlhttp = new XMLHttpRequest();
        //var xmlhttp = (window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
        /**
 	* Description
 	* @method onreadystatechange
 	* @return 
 	*/
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState ==4 && xmlhttp.status==200 && args) {
                        var text        = xmlhttp.responseText;
                        var xml         = xmlhttp.responseXML;
                        try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){components.utils.reportError("Error JSON.parse "+e);}
			callback(text, json, args, object);
                }
        }
        xmlhttp.open(request_type,cgi_file,asyn);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(post_data);
}
/**
 * Description
 * @method highlight_texts
 * @param {} search_key
 * @return 
 */

function highlight_texts(search_key, wnd, flag){
	search_key	= search_key.replace(/\bthe\b/gi, '');
	var regx 	= new RegExp("("+search_key.replace(/\s+/g,'\\s*')+"|"+search_key.split(" ").join("|")+")","gi");
	var doc		= wnd.document;
	var elements 	= doc.querySelectorAll("body, body *"); 
	var result_nodes=[[],[]];
	var child;
	for(var i = 0, elem_len = elements.length; i < elem_len; i++) {
		
		var childs = elements[i].childNodes;
		for(var ind = 0, len = childs.length; ind < len;ind++){
			var child	= childs[ind];
			if(child.nodeType == 3) {
				var custom_index 	= Number(child.parentNode.getAttribute("customindex")) + (ind + 1);
				if(custom_index == (ind + 1))
					continue
				var matches	= child.nodeValue.match(regx);
				if(matches && matches.length){
					//console.log("matches",matches, child);
					result_nodes[0].push(custom_index);
				 	var cords	= highlight_text_nodes(doc, child, matches, flag);
					result_nodes[1].push(cords);
				}
			
			}
		}
	}
	return result_nodes;
}
/**
 * Description
 * @method highlight_text_nodes
 * @param {} doc
 * @param {} elem
 * @param {} matches
 * @return 
 */
function highlight_text_nodes(doc,elem, matches, flag){
	var final_str	= '',
    	dom_obj     	= elem,
	str		= elem.nodeValue,
	range		= doc.createRange();
	var html 	= doc.documentElement; 
	var left 	= (html && html.scrollLeft || 0);
	var top 	= (html && html.scrollTop  || 0);
	var textIndent	= parseInt(get_css_value(dom_obj.parentNode,doc,"textIndent"));
	range.selectNodeContents(dom_obj);
	matches.forEach(function(split_char){
		var start		= str.indexOf(split_char);
		var end 		= start+split_char.length;
		range.selectNodeContents(dom_obj);
		while(end > -1){
		    	//console.log(" range", start, end, flag, left, top, range.toString());
			try{range.setStart(elem, start);
			range.setEnd(elem, end);
			if(flag == true){
				var rect 	= range.getBoundingClientRect();
        			var x 		= (rect.left + left - textIndent);
        			var y 		= (rect.top +top);
        			var w 		= (rect.right - rect.left);
        			var h 		= (rect.bottom - rect.top);
				//console.log("Elem "+elem+" ===== "+rect.left+" === "+rect.right+rect.top);
				final_str 	+= x+"_"+y+"_"+w+"_"+h+"#";
			}else{
				var span = document.createElement('span');
      				span.style.backgroundColor = "yellow";
      				range.surroundContents(span);
      				console.log("span ",span, elem, elem.parentNode)
			}
			start		= end + 1; 
			end 		= str.indexOf(split_char, end + 1);}catch(e){end = -1;}
		}
	});
	return final_str.replace(/#$/,"");
}
function get_content_window(flag){
	var panel       	= Panel.main_window.document.getElementById('log-panel');
	var browser             = Panel.main_window.document.getElementById("my-browser");
	Logger.push("Panel status "+panel.state);
	if(panel.state == "open")
		content =  browser.contentWindow;
	else
        	content         = Id('content',Panel.main_window.document).contentWindow.top.window;
	return content;
}
function get_content_doc(){
	return Id('content',Panel.main_window.document).contentWindow.top.document;
}
function get_page_size(doc){
        var maxH 	= Math.max( Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight), Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight), Math.max(doc.body.clientHeight, doc.documentElement.clientHeight));
        var maxW 	= Math.max( Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth), Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth), Math.max(doc.body.clientWidth, doc.documentElement.clientWidth));
	return {pw : maxW, ph : maxH};
	
}
function create_log_file(data, file_name){
	try{
		var file		= FileUtils.getDir("Desk", ["Log"], true);
		file.append(file_name);
		var ostream		= FileUtils.openSafeFileOutputStream(file);
		var converter 		= Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);  
		converter.charset 	= "UTF-8";  
		var istream 		= converter.convertToInputStream(data);  
		NetUtil.asyncCopy(istream, ostream, function(){}); 
	}catch(e){
		Logger.push("Error create_log_file "+e);
	}
}
/*Element.prototype.attr  = function(prop, value){
        var attr        = {};
        attr[prop]      = value
        if(arguments.length == 2 || prop instanceof Object && (attr = prop)){
                for(var key in attr)
                        this.setAttribute(key, attr[key]);
        }else
                return this.getAttribute(prop);
}*/

/*
 * Operating system detection
 *
 * Returns "WINNT" on Windows Vista, XP, 2000, and NT systems;
 * "Linux" on GNU/Linux; and "Darwin" on Mac OS X.
 */ 
function get_os_name(){
	var osString = components.classes["@mozilla.org/xre/app-info;1"].getService(components.interfaces.nsIXULRuntime).OS;
	return osString;
}
/*
 * Set Panel Position
 */
function set_panel_pos(){
	var panel       = Panel.main_window.document.getElementById('log-panel');
	if(/Linux/.test(get_os_name()))
                panel.setAttribute("level",'top');
        else    
                panel.removeAttribute("level");

}
exports.DOMUtils    = {}
exports.DOMUtils.is_all_ws    = function is_all_ws( nod )
{
  return !(/[^\t\n\r ]/.test(nod.textContent));
}
exports.DOMUtils.is_ignorable = function is_ignorable( nod )
{
  return ( nod.nodeType == 8) || // A comment node
         ( (nod.nodeType == 3) && exports.DOMUtils.is_all_ws(nod) ); // a text node, all ws
}

exports.DOMUtils.node_before    = function node_before( sib )
{
  while ((sib = sib.previousSibling)) {
    if (!exports.DOMUtils.is_ignorable(sib)) return sib;
  }
  return null;
}
exports.DOMUtils.node_after = function node_after( sib )
{
  while ((sib = sib.nextSibling)) {
    if (!exports.DOMUtils.is_ignorable(sib)) return sib;
  }
  return null;
}

exports.DOMUtils.last_child = function last_child( par )
{
  var res=par.lastChild;
  while (res) {
    if (!exports.DOMUtils.is_ignorable(res)) return res;
    res = res.previousSibling;
  }
  return null;
}

exports.DOMUtils.first_child    = function first_child( par )
{
  var res=par.firstChild;
  while (res) {
    if (!exports.DOMUtils.is_ignorable(res)) return res;
    res = res.nextSibling;
  }
  return null;
}
exports.DOMUtils.data_of    = function data_of( txt )
{
  var data = txt.textContent;
  // Use ECMA-262 Edition 3 String and RegExp features
  data = data.replace(/[\t\n\r ]+/g, " ");
  return data;
  if (data.charAt(0) == " ")
    data = data.substring(1, data.length);
  if (data.charAt(data.length - 1) == " ")
    data = data.substring(0, data.length - 1);
  return data;
}
