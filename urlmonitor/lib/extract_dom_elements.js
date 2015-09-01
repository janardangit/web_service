exports.get_dom_tree = get_dom_tree;
exports.disp_none_elems = disp_none_elems;
exports.isHref = isHref;
exports.check_href = check_href;
exports.get_click_node_json = get_click_node_json;
exports.clear_extra_attr = clear_extra_attr;
exports.extract_dom_content_tree = extract_dom_content_tree;
exports.set_custom_index = set_custom_index;
exports.set_sibling_index = set_sibling_index;
exports.create_dummy_html = create_dummy_html;
exports.extract_dom_nodes_details = extract_dom_nodes_details;
exports.read_dom_node_info = read_dom_node_info;
exports.read_txt_node_info = read_txt_node_info;
exports.add_pseudo_elems = add_pseudo_elems;
exports.conver_attr_str_html_attr = conver_attr_str_html_attr;
exports.insert_query_selector = insert_query_selector;
exports.insert_dom_info = insert_dom_info;
exports.insert_child_nodes = insert_child_nodes;
exports.insert_parent_nodes = insert_parent_nodes;
exports.get_words_info = get_words_info;
exports.get_word_selection_rect = get_word_selection_rect;
exports.read_element_attr = read_element_attr;
exports.is_visible = is_visible;
exports.get_css_value = get_css_value;
exports.read_computed_style_extd = read_computed_style_extd;
exports.get_pseudo_elements_style = get_pseudo_elements_style;
exports.isPageStyle = isPageStyle;
exports.get_selector_specificity = get_selector_specificity;
exports.store_style_prop = store_style_prop;
exports.get_css_style = get_css_style;
exports.str_trim = str_trim;
exports.get_absolute_pos = get_absolute_pos;
exports.get_rect_box_text = get_rect_box_text;
exports.get_rect_box = get_rect_box;
exports.get_area_rect = get_area_rect;
exports.get_shape_rect = get_shape_rect;
exports.get_shape_default = get_shape_default;
exports.get_shape_circle = get_shape_circle;
exports.get_shape_poly = get_shape_poly;
exports.get_bounding_rect = get_bounding_rect;
exports.get_text_bounding_rect = get_text_bounding_rect;
exports.convert_rgb_to_hash = convert_rgb_to_hash;
/*****************************************************************************
 * Author	: Angamuthu G
 * Date		: Aug 06,2013
 * Brief	: Parse DOM-tree of html document
 *****************************************************************************/ 
const {components, Cc, Ci} = require("chrome");
var inIDOMUtils = components.classes["@mozilla.org/inspector/dom-utils;1"].getService(components.interfaces.inIDOMUtils),
re_cssText	= /(?:[^;\(]*(?:\([^\)]*?\))?[^;\(]*)*;?/g,
re_prop		= /\s*([^:\s]*)\s*:\s*(.*?)\s*(! important)?;?$/,
dom_tree_json	= new Object(),
split_char	= " ";

var utils = require("./utils")
var eventLisiner = require('./event_listener_service')
var document = null;

/*
 * Date		: Aug 06,2013
 * Brief	: Parse DOM-tree of html document
 * Parameters	:
 * 		@param{HTMLDOMObject} 	obj		=> HTML element
 * 		@param{Number} 		parent_id	=> Parent custom index
 * 		@param{Document} 	document_node	=> Document
 */
function get_dom_tree(dom_obj,parent_id,document_node, store_dom_tree, dom_storage, custom_index){
	var thisobj = {};
	document = document_node;
	utils.Logger.push(arguments.callee.caller);
	thisobj.node_id		= 1;
	thisobj.str		= '';
	thisobj.body_str		= '';
	thisobj.html		= document.createElement("html");
	//console.log('==='+document_node.createElement("html"));
	thisobj.current		= thisobj.html;
	utils.setAttr(thisobj.current,{child_length:0, charset:document_node.characterSet, nsign:'html', sign:'html_1', signidx:'0', level:1, url:document_node.defaultView.location.href});
    	var head_tag    = utils.createDOM('head', {}, thisobj.current);
    	utils.createDOM('meta', {'charset':document_node.characterSet}, head_tag);
	thisobj.style_props	= {};
	thisobj.rect		= {x:0,y:0};	
	thisobj.bx			= 0;
	thisobj.by			= 0;
	thisobj.iframe		= 'no';
	if(custom_index == true)
		extract_dom_nodes	= set_custom_index;
	else
		extract_dom_nodes	= extract_dom_nodes_details;
		
	//try{
		extract_dom_content_tree(dom_obj,parent_id,document_node, thisobj);
	//}catch(e){
		//components.utils.reportError("Extraction Error : "+e);
		//utils.Log("Extraction Error : "+e);
	//}
	//create_log_file(this.html.outerHTML, "out_html.html");
	//Logger.push("Str : "+this.html.outerHTML);
	//Services.console.logStringMessage("=================================================\njSON : "+JSON.stringify(this.dom_tree));
	if(store_dom_tree == 1 && dom_storage){
		dom_storage.html	= thisobj.html;
	}
	return thisobj.str;
}
function disp_none_elems(doc){
	var elems	= doc.querySelectorAll(".pageheaderbreakingitem");
	for(var ind = 0, len = elems.length; ind < len;ind++)
		elems[ind].style.display	= 'none';
}
function isHref(index, html){
	var node	= html.querySelector('[customindex="'+index+'"]');
	var new_index	= index;
	if(node.tagName == "text"){
		var parent_node	= node.parentNode;
		new_index	= parent_node.getAttribute('customindex');
		node		= parent_node;
	}
	var href	= check_href(node);
	if(href){
		html.setAttribute("href_true", href);
		html.setAttribute("url", node.getAttribute("href"));
		return true;
	}
	var parent_node	= node.parentNode;
	if( "a" != node.tagName && "a" == parent_node.tagName && ! (node.hasAttribute("onclick_event") || node.hasAttribute("click_event") || node.hasAttribute("onmousedown_event") || node.hasAttribute("mousedown_event"))){
		href	= check_href(parent_node);
		if(href) {
			html.setAttribute("href_true", href);
			html.setAttribute("url", parent_node.getAttribute("href"));
			return true;
		}
			
	}
	
}
function check_href(node){
	if(node.tagName != 'a')
		return false;
	var target	= node.getAttribute("target");
	var href	= node.getAttribute("href");
	var href_value	= node.getAttribute("href_value");
	if(node.getAttribute('iframe') == 'no' && href && !(target && '_blank' != target) && !(/^\s*javascript\s*\:/.test(href) || /^\s*$/.test(href)) && href_value != "Y")
		return true;
	return false;
}
function  get_click_node_json(c_index, html){
	var c_indexs		= '';
	var html_node		= document.createElement("html");
	var index		= c_index.shift();
	var current_node 	= html.querySelector('[customindex="'+index+'"]');
	c_indexs		= index;
	var new_html		= clear_extra_attr(current_node.cloneNode(true));
	current_node		= current_node.parentNode;
	if(isHref(index, html)){
		html.setAttribute("c_index",c_indexs);
		html.innerHTML	= '';
		return html;
	}
	while(current_node){
		var new_node	= clear_extra_attr(current_node.cloneNode(true));
		new_node.appendChild(new_html);
		new_html	= new_node;
		current_node	= current_node.parentNode;
	}
	for(var ind = 0, len = c_index.length;ind < len;ind++){
		var index	= c_index[ind];
		if(isHref(index, html)){
			html.setAttribute("c_index",c_indexs);
			html.innerHTML	= '';
			return html;
		}
		var current_node 	= html.querySelector('[customindex="'+index+'"]');
		c_indexs		+= '#'+current_node.attr("customindex"); 
		var new_node		= clear_extra_attr(current_node.cloneNode(true));
		var parent_node		= current_node.parentNode;
		var old_node		= new_html.querySelector('[customindex="'+parent_node.getAttribute("customindex")+'"]');
		while(old_node == null){
			var node    	= clear_extra_attr(parent_node.cloneNode(true));
                	node.appendChild(new_node);
                	new_node        = node;
                	parent_node    	= parent_node.parentNode;
			old_node	= new_html.querySelector('[customindex="'+parent_node.getAttribute("customindex")+'"]');
		}
		old_node.appendChild(new_node);
	}
	new_html.setAttribute("c_index",c_indexs);
	//html_node.appendChild(new_html);
	return new_html;
}
function clear_extra_attr(node){
	var new_node	= document.createElement(node.tagName);
	if(node.tagName == 'text'){
		new_node.setAttribute('customindex',node.getAttribute('customindex'));
		new_node.innerHTML	= node.textContent;
		return new_node;
	}
	if(!node.hasAttribute("orig_attributes")) return new_node;
	var attrib	= node.getAttribute("orig_attributes").split(',');
	attrib.forEach(function(value){
		new_node.setAttribute(value,node.getAttribute(value));
	});
	if(node.tagName == 'text')
		new_node.innerHTML	= node.textContent;
	return new_node;
}

function extract_dom_content_tree(dom_obj,parent_id,document_node, extract){
	extract.style_props	= {};
	var visible		= true;
	try {
        if(/^i[A-Z]$/.test(dom_obj.parentNode.id))
			dom_obj.style.display	= 'block';
		visible = is_visible(dom_obj, document_node);
		visible	= (/pageheaderbreakingitem/.test(dom_obj.className) || /country-dropdown modal js-country-dropdown closed/.test(dom_obj.className))?false:visible;
	}catch(e){}
	var current_parent	= extract.current;
	extract_dom_nodes(dom_obj,parent_id,document_node, extract, visible);
	if(dom_obj.nodeType == 1 && visible && /(iframe|frame)$/.test(dom_obj.tagName.toLowerCase())){
		//current_parent	= extract.current;
		extract.bx 	= extract.rect.x;
		extract.by 	= extract.rect.y;
		extract.iframe	= 'yes';
		extract_dom_content_tree(dom_obj.contentDocument.body,(extract.node_id - 1),dom_obj.contentDocument, extract);
		extract.bx = 0;
		extract.by = 0;
		extract.iframe	= 'no';
	}else if(dom_obj.childNodes.length > 0 && visible){
		extract.current.setAttribute("child_length", 0);
		//current_parent	= extract.current;
		//extract_dom_content_tree(dom_obj.firstChild,(extract.node_id - 1), document_node, extract);
		var first_child = utils.DOMUtils.first_child(dom_obj);
                //console.log('=========='+first_child+ "=======" + dom_obj.childNodes.length + '+++' +dom_obj.innerHTML);
		if (first_child){
			extract_dom_content_tree(first_child,(extract.node_id - 1), document_node, extract);
		}
	}
	try{
		var class_dict	= add_pseudo_elems(dom_obj);
		if(class_dict){
			var txt_nodes	= current_parent.querySelector('[customindex="'+dom_obj.getAttribute("customindex")+'"]').querySelectorAll("text");
			var txt_len = txt_nodes.length; 
			if(txt_len){
				txt_nodes[0].textContent = ('before' in class_dict)?(class_dict['before']+txt_nodes[0].textContent):txt_nodes[0].textContent;
				txt_nodes[txt_len - 1].textContent = ('after' in class_dict)?(txt_nodes[txt_len - 1].textContent+class_dict['after']):txt_nodes[txt_len - 1].textContent;
			}
		}
	}catch(e){utils.Log("Error pseudo txts "+e)}
	//if(dom_obj.nextSibling){
    var next_sib = utils.DOMUtils.node_after(dom_obj);
	if(next_sib){
		extract.current	= current_parent;
		//extract_dom_content_tree(dom_obj.nextSibling,parent_id,document_node, extract);
                console.log('=========='+next_sib);
		extract_dom_content_tree(next_sib,parent_id,document_node, extract);
	}
}
function set_custom_index(dom_obj,parent_id,document_node, extract, visible){
	if(dom_obj.nodeType == 1 && visible){
		try{dom_obj.setAttribute('customindex', extract.node_id);}catch(e){}
		extract.node_id += 1;
	}else if(dom_obj.nodeType == 3 && (txt = dom_obj.nodeValue))
		extract.node_id += 1;
}
function set_sibling_index(current_node, child_length){
	try{
		var orig_node	= current_node;
		var tag_name	= current_node.tagName.toLowerCase();
		for(var ind = 1; ind < child_length; ind++){
			var previous_node	= current_node.previousSibling;
			orig_node.setAttribute("p_"+ind, previous_node.tagName.toLowerCase());
			current_node.setAttribute("prev_sib_tag", previous_node.tagName.toLowerCase());
			previous_node.setAttribute("next_sib_tag", current_node.tagName.toLowerCase());
			previous_node.setAttribute("n_"+ind, tag_name);
			current_node	= previous_node;
		}
	}catch(e){utils.Log("Error "+e+" lineno : "+e.lineNumber)}
}
function create_dummy_html(tag_name, extract, txt){
	var parent_node	= extract.current;
	var child_length= Number(parent_node.getAttribute("child_length")) + 1;
	var nsign	= parent_node.getAttribute("nsign");
	var sign	= parent_node.getAttribute("sign");
	var signidx	= parent_node.getAttribute("signidx");
	var level	= Number(parent_node.getAttribute("level")) + 1;
	parent_node.setAttribute("child_length", child_length);
	extract.current         	= utils.createDOM(tag_name, {txt:txt, child_pos:child_length,customindex:extract.node_id,prev_sib_tag:'NULL', next_sib_tag:'NULL',nsign:nsign+">"+tag_name, sign:sign+">"+tag_name+"_"+child_length, signidx:signidx+">"+extract.node_id, level:level, iframe:extract.iframe}, extract.current);
	extract.node_id += 1;
	set_sibling_index(extract.current, child_length);
}
function extract_dom_nodes_details(dom_obj,parent_id,document_node, extract, visible){
	//try{
		if (dom_obj.nodeType == 1 && visible){
			dom_obj.setAttribute('customIndex', extract.node_id);
			var tag_name_orig	= dom_obj.tagName.toLowerCase();
			var tag_name	= (tag_name_orig != "body")?dom_obj.tagName: (extract.node_id != 1)?"IBODY":"BODY";
			tag_name	= tag_name.replace(/:/g,"");
			tag_name	= tag_name.replace(/-/g,"");
			create_dummy_html(tag_name.toLowerCase(), extract,'');
			read_dom_node_info(dom_obj, document_node, extract);
		}else if(dom_obj.nodeType == 3 && dom_obj.nodeValue)
			read_txt_node_info(dom_obj, document_node, extract,dom_obj.nodeValue,parent_id);
	//}catch(e){	
	//	utils.Logger.push("Error extract_dom_nodes "+e.lineNumber);
		//components.utils.reportError("Error extract_dom_nodes "+e);
	//}
	return '';
}
/*
 * Date		: Aug 08,2013
 * Brief	: Extract DOM node info whose nodeType is equal to 1  
 * Parameters	:
 * 		@param{HTMLDOMObject} 	obj		=> HTML element
 * 		@param{Document} 	document_node	=> Document
 * 		@param{Object} 		extract		=> Extration function's object 
 */
function read_dom_node_info(dom_obj, document_node, extract){
	get_rect_box(dom_obj, document_node,extract);
	read_element_attr(dom_obj, {}, extract.current);
	read_computed_style_extd(dom_obj,document_node,extract);
}
/*
 * Date		: Aug 08,2013
 * Brief	: Extract TEXT node information 
 * Parameters	:
 * 		@param{HTMLDOMObject} 	obj		=> HTML element
 * 		@param{Document} 	document_node	=> Document
 * 		@param{Object} 		extract		=> Extration function's object 
 * 		@param{String}		txt		=> Text content of text node
 * 		@param{String} 		parent_id	=> Immediate Parent id dom element
 */
function read_txt_node_info(dom_obj, document_node, extract,txt, parent_id){
        //removed condition for \n with '' some issue in http://www.ajpark.com  
	//txt	= txt.replace(/\n/g, '');
	create_dummy_html('text', extract,'');
	var txt_node 	= document_node.createTextNode(utils.DOMUtils.data_of(dom_obj));
	extract.current.appendChild(txt_node);	
	extract.current.setAttribute("txt_content", utils.DOMUtils.data_of(dom_obj));
	try{var text_fonts	= getTextFont(dom_obj.parentNode, extract);}catch(e){var text_fonts      = "";}	
	var words_info		= get_words_info(dom_obj,document_node, extract);
	get_rect_box_text(dom_obj, document_node, extract);
}
function add_pseudo_elems(dom_obj){
	//var pseudo_elements=[":active",":after",":before",":checked","::choices",":default",":dir()",":disabled",":empty",":enabled",":first",":first-child","::first-letter","::first-line",":first-of-type",":focus",":fullscreen",":hover",":indeterminate",":in-range",":invalid",":lang()",":last-child",":last_of_type",":left",":link",":not()",":nth-child()",":nth-last-child()",":nth-last-of_type()",":nth-of_type()",":only-child",":only-of_type",":optional",":out-of-range",":read-only",":read-write","::repeat-index","::repeat-item",":required",":right",":root",":scope","::selection",":target",":valid","::value",":visited",":-moz-selection"];
	var class_dict	= {};
	var pseudo_elements=[":after",":before"]
	for(var ind = 0, len = pseudo_elements.length; ind < len;ind++){
		var rules= inIDOMUtils.getCSSStyleRules(dom_obj, pseudo_elements[ind]);
		if(!rules) continue;
		for(var r = 0, r_len = rules.Count();r < r_len;r++){
			var content= rules.GetElementAt(r).style.cssText;
			if(content.length > 0){
				var cssTexts	= content.split(";");
				cssTexts.forEach(function(value){
					var contents	= value.split(":");
					if(contents[0] == 'content' && contents[1])
						try{class_dict[pseudo_elements[ind].replace(':','')]	= eval(contents[1]);}catch(e){}
				});
			}
		}
	}
	return class_dict;
}
function conver_attr_str_html_attr(string){
	return string.replace(/\_\|\_/g, "' ").replace(/\:=\:/g, "='").replace(/^'/, '') +"'";
}
function insert_query_selector(tag_name, document_node, extract,parent_id){
	if(/ibody/.test(tag_name.toLowerCase())){
		extract.dom_tree[extract.node_id]['query_selector'] = "";
		return;
	}
	var parent_selector	= extract.dom_tree[parent_id]['query_selector'];
	try{
		var selector	= document_node.querySelectorAll(tag_name);
		extract.dom_tree[extract.node_id]['query_selector']     = parent_selector+" "+tag_name;
	}catch(e){
		extract.dom_tree[extract.node_id]['query_selector']	= tag_name;
	}
}
/*
 * Date		: Sep 13, 2013
 * Brief	: Insert DOM information to dom_tree json
 * Parameters	:
 * 		@param{String} 		parent_id	=> Immediate Parent id dom element
 * 		@param{Object} 		extract		=> Extration function's object 
 * 		@param{String} 		tag_name	=> tag name of the dom node
 */
function insert_dom_info(extract, parent_id, tag_name){
	extract.dom_tree[extract.node_id]			= new Object();
	extract.dom_tree[extract.node_id]['parent']		= parent_id;
	extract.dom_tree[extract.node_id]['tagname']		= tag_name;
	extract.dom_tree[extract.node_id]['iframe']		= extract.iframe;
	insert_parent_nodes(parent_id, extract);
	insert_child_nodes(parent_id, extract);
}
/*
 * Date		: Sep 13, 2013
 * Brief	: Insert current node id to parent's children array  
 * Parameters	:
 * 		@param{String} 		parent_id	=> Immediate Parent id dom element
 * 		@param{Object} 		extract		=> Extration function's object 
 */
function insert_child_nodes(parent_id, extract){
	extract.dom_tree[extract.node_id]['children']	= [];
	if(parent_id in extract.dom_tree)
		extract.dom_tree[parent_id]['children'].push(extract.node_id);
}
/*
 * Date		: Sep 13, 2013
 * Brief	: Clone parent's parent nodes array and Push immediate parent id to array  
 * Parameters	:
 * 		@param{String} 		parent_id	=> Immediate Parent id dom element
 * 		@param{Object} 		extract		=> Extration function's object 
 */
function insert_parent_nodes(parent_id, extract){
		if(parent_id	!= 0){
			extract.dom_tree[extract.node_id]['parent_nodes']	= extract.dom_tree[parent_id]['parent_nodes'].slice(0);
			extract.dom_tree[extract.node_id]['parent_nodes'].push(parent_id);
		}else
			extract.dom_tree[extract.node_id]['parent_nodes']	= [];
}
/*
 * Date		: Aug 08,2013
 * Brief	: Get the words inside textcontent and rectangle coordinates for those
 * Parameters	:
 * 		@param{HTMLDOMObject} 	obj		=> HTML element
 * 		@param{Document} 	document_node	=> Document
 */
function get_words_info(dom_obj,document_node, extract){
	var doc 	= document_node.documentElement, 
	left 		= (doc && doc.scrollLeft || 0),
	top 		= (doc && doc.scrollTop  || 0),
	str		= dom_obj.nodeValue,
	range		= document_node.createRange(),
	start		= 0,
	end 		= str.indexOf(split_char), 
	final_str	= "",
	textIndent	= parseInt(get_css_value(dom_obj.parentNode,document_node,"textIndent"));
	range.selectNodeContents(dom_obj);
	while(end > -1){
		final_str	+= get_word_selection_rect(dom_obj,start,end,left,top,range, textIndent);
		start		= end + 1; 
		end 		= str.indexOf(split_char, end + 1);
	}
	final_str	= final_str+get_word_selection_rect(dom_obj,start,str.length,left,top,range, textIndent);
	extract.current.setAttribute("word-info", final_str.replace(/^_\|_/,''));
	return final_str;
}
function get_word_selection_rect(dom_obj,start,end,left,top,range, textIndent){
	range.setStart(dom_obj, start);
	range.setEnd(dom_obj, end);
	var rect 	= range.getBoundingClientRect();
        var x 		= (rect.left + left - textIndent);
        var y 		= (rect.top +top);
        var w 		= (rect.right - rect.left);
        var h 		= (rect.bottom - rect.top);
        if (w < 1) return "";
        if (h < 1) return "";
	//var str 	= "_|_"+range.toString()+":==:"+x+"_"+y+"_"+w+"_"+h;
	var str 	= "_|_"+range.toString()+"^==^"+x+"_"+y+"_"+w+"_"+h;
	return str;
}

/*
 * Date		: Aug 06,2013
 * Brief	: Read & return the details of attributes of html element 
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function read_element_attr(dom_obj, extract, current){
	var node_attr   = dom_obj.attributes;
	var orig_attr	= '';
	for (var ind = 0,len = node_attr.length; ind < len; ind++){
		var key			= node_attr[ind].name.replace(/\:/g,"_");
		var value		= ("src" == key)?dom_obj.src:("href" == key)?dom_obj.href:node_attr[ind].value;
		if(key == "href" && (/^#/.test(dom_obj.getAttribute("href")) || dom_obj.getAttribute("href").trim() == '')){
			current.setAttribute("href_value", "Y");
			orig_attr	+= 'href_value,';
		}
		orig_attr	+= key+',';
		try{current.setAttribute(key, value.replace(/\"/g, '').replace(/\'/g, ''));}catch(e){utils.Logger.push("Error "+e)}
	}
	var event_info	= eventLisiner.aEventListener.get_event_listener_info(dom_obj);      
	event_info.forEach(function(value){
		orig_attr	+= value+'_event,';
		//current.setAttribute(value+"_event", 'Y');
		if ( value !='' )
                {
                    var res = value.match(/:/gi); 
                    if (":"!=res)
                    {   
		        current.setAttribute(value+"_event", 'Y');
                    }
                }  
	});
	orig_attr	+= 'nsign,customindex,iframe';
	current.setAttribute('orig_attributes', orig_attr);
}
/*
 * Date		: Aug 06,2013
 * Brief	: Check visibility of dom node
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function is_visible(obj,doc) {
	/*var rect	= obj.getBoundingClientRect();
	var overlap_elem= doc.elementFromPoint(rect.left, rect.top);
	if(obj != overlap_elem) return false; */
	if (!obj) return false;
	if (!obj.parentNode) return false;
	var style	= (doc.defaultView && doc.defaultView.getComputedStyle)?doc.defaultView.getComputedStyle(obj, ""):(obj.style)?obj.style:obj.currentStyle;
	//if (style.display == 'none' || style.visibility == 'hidden') return false;
	if (style.display == 'none') return false; //http://www.jolicoeurlacasse.com
	return true;
}

/*
 * Date		: Aug 06,2013
 * Brief	: Get CSS property value
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function get_css_value(obj,doc, prop) {
	if (!obj) return "";
	if (!obj.parentNode) return "";
	var style	= (doc.defaultView && doc.defaultView.getComputedStyle)?doc.defaultView.getComputedStyle(obj, ""):(obj.style)?obj.style:obj.currentStyle;
	return style[prop];
}
/*
 * Date		: Aug 06,2013
 * Brief	: To get Computed styles of html element
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function read_computed_style_extd(dom_obj,document_node, extract){
	var args		= inIDOMUtils.getCSSStyleRules(dom_obj);
	get_css_style(args,dom_obj,document_node,extract);
	store_style_prop(dom_obj.getAttribute("style"), extract);
	var style_info	= "";
	var doc	= document_node;
	for(var key in extract.style_props){
		//style_info	+= key+":"+extract.style_props[key]['value']+";";
		var value_st	= extract.style_props[key]['value'];
		style_info	+= key+"_^_"+extract.style_props[key]['value']+"_^^_";
                try {
		    if ((key == 'background' || key == 'background-image') &&  value_st.match('url')) {
			var style	= (doc.defaultView && doc.defaultView.getComputedStyle)?doc.defaultView.getComputedStyle(dom_obj, ""):(dom_obj.style)?dom_obj.style:dom_obj.currentStyle;
			var img	= style['backgroundImage'];
			if (img){
				style_info	+= "background-image_^_"+style['backgroundImage']+"_^^_";
				
			}
			
			
		    }
                } catch(e){utils.Log("Error : background-image "+e)}
		//extract.current.setAttribute(key,extract.style_props[key]['value']);
	}
	extract.current.setAttribute("style-information",style_info);
	get_pseudo_elements_style(dom_obj, extract);
}
function get_pseudo_elements_style(dom_obj, extract){
	var pseudo_elements	=[":after", ":before", "::first-letter", "::first-line", "::selection"];
	for(var ind = 0, len = pseudo_elements.length; ind < len;ind++){
		var rules	= inIDOMUtils.getCSSStyleRules(dom_obj, pseudo_elements[ind]);
		if(!rules) continue;
		for(var r = 0, r_len = rules.Count();r < r_len;r++){
			var content	= rules.GetElementAt(r).style.cssText;
			if(content.length > 0){
				extract.current.setAttribute(dom_obj.tagName+pseudo_elements[ind],content);
			}
		}
	}
}
/*
 * Date		: Aug 13,2013
 * Brief	: Check whether given stylesheet is Browser's default style or imported styles
 * Parameters	:
 * 		@param{Object} styleSheet => Stylesheet 
 */
function isPageStyle(styleSheet)
{
	if (styleSheet.ownerNode)
		return true;

	if (styleSheet.ownerRule instanceof components.interfaces.nsIDOMCSSImportRule)
		return isPageStyle(styleSheet.parentStyleSheet);

	return false;
}
function get_selector_specificity(selector_text, dom_obj,document_node){
	var texts	= selector_text.split(",");
	for(var ind = 0, len = texts.length; ind < len; ind++){
		var value	= texts[ind];
		var selectors	= document_node.querySelectorAll(value);
		if(Array.prototype.indexOf.call(selectors, dom_obj) >= 0){
			var ids		= (/#/.test(value))?value.match(/#/g).length:0;
			var classs	= (/\./.test(value))?value.match(/\./g).length:0;
			var elem	= (/(^|\s+)[^\.\#]/.test(value))?value.match(/(^|\s+)[^\.\#]/g).length:0;
			return	""+ids+classs+elem;
		}
	}
	return "000";
}
/*
 * Date		: Aug 14,2013
 * Brief	: Parse style properties and store in JSON obj
 * Parameters	:
 * 		@param{String} cssText	=> CSS Style text
 */
function store_style_prop(cssText, extract){
	if(!cssText) return 
	var styles	= cssText.match(re_cssText);
	for(var ind = 0, len = styles.length; ind < len; ind++){
		var st	= re_prop.exec(styles[ind]);
		if(!st) continue;
		if(!(st[1] in extract.style_props) || st[3] || !extract.style_props[st[1]]['imp'])
			extract.style_props[st[1]] = {value:convert_rgb_to_hash(st[2]),imp:!!st[3]};
	}
}

/*
 * Date		: Aug 06,2013
 * Brief	: Parse CSS style rules
 * Parameters	:
 * 		@param{nsISupportsArray} arr	=> Array CSS style Rules
 */
function get_css_style(arr,dom_obj,document_node, extract){
	for(var ind = 0, len = arr.Count();ind < len;ind++){
		var rule = arr.GetElementAt(ind);
		if (!isPageStyle(rule.parentStyleSheet))
			continue;
		store_style_prop(rule.style.cssText, extract);
	}
}
function str_trim(str){
	if(!str) return "";
	return str.replace(/^\s+/,"").replace(/\s+$/,"");
}
/*
 * Date		: Aug 06,2013
 * Brief	: To get absolute positon of html element
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function get_absolute_pos( obj) {
	var cur_left = 0,cur_top = 0;
	if(obj.offsetLeft) cur_left += parseInt(obj.offsetLeft);
	if(obj.offsetTop) cur_top += parseInt(obj.offsetTop);
	if(obj.scrollTop && obj.scrollTop > 0) cur_top -= parseInt(obj.scrollTop);
	if(obj.offsetParent) {
		var pos 	= get_absolute_pos(obj.offsetParent);
		cur_left 	+= pos[0];
		cur_top 	+= pos[1];
	} else if(obj.ownerDocument) {
		var window_obj 	= obj.ownerDocument.defaultView;
		if(!window_obj && obj.ownerDocument.parentWindow) window_obj = obj.ownerDocument.parentWindow;
		if(window_obj) 
			if(window_obj.frameElement) {
				var pos 	= get_absolute_pos(window_obj.frameElement);
				cur_left 	+= pos[0];
				cur_top 	+= pos[1];
			}
	}
	return [cur_left,cur_top];
}
function get_rect_box_text(dom_obj, document_node,extract){
    if(dom_obj.parentNode.tagName.toLowerCase() == "cufontext")
        dom_obj = dom_obj.parentNode;
	var textIndent	= parseInt(get_css_value(dom_obj.parentNode,document_node,"textIndent"));
	var rect	= get_bounding_rect(dom_obj);	 
	var text_box	= get_text_bounding_rect(dom_obj, document_node, rect,extract);	 
	//change for cufontext node x value in minus on 30/09/2014 08:00PM 
	//var text_box	= get_text_bounding_rect(dom_obj.parentNode, document_node, rect,extract);	 
	var rect_b	= (text_box.x - textIndent)+ '_' + text_box.y + '_' + ((text_box.x - textIndent) +text_box.w)+ '_' + (text_box.y + text_box.h);
	if(dom_obj.parentNode.tagName.toLowerCase() == "option")
		utils.setAttr(extract.current,{rect:"0_0_0_0_0_0_0_0", x:0,y:0, w:0,h:0, rect1:"0_0_0_0"});
	else
		utils.setAttr(extract.current,{rect:rect_b, x:text_box.x - textIndent,y:text_box.y, w:text_box.w,h:text_box.h, rect1:rect_b});
}
function get_rect_box(dom_obj, document_node, extract){
	var textIndent	= parseInt(get_css_value(dom_obj,document_node,"textIndent"));
	var rect	= get_bounding_rect(dom_obj);	 
	var text_box	= get_text_bounding_rect(dom_obj, document_node, rect,extract);	 
	extract.rect	= rect;
	if(dom_obj.tagName.toLowerCase() == "img"){
		var rects	= rect.x + '_' + rect.y + '_' + rect.w + '_' + rect.h;
		var rects_attr	= rect.x + '_' + rect.y + '_' + (rect.w + rect.x) + '_' + (rect.h + rect.y);
		utils.setAttr(extract.current, {x:rect.x, y:rect.y,w:rect.w,h:rect.h,rect:rects_attr,rect1:rects_attr});
	}else{
		if(dom_obj.tagName.toLowerCase() == "area"){
			var rect	= get_area_rect(dom_obj,extract, rect);
			text_box.x	= rect.x;
			text_box.y	= rect.y;
			text_box.w	= rect.w;
			text_box.h	= rect.h;
			textIndent	= 0;
		}
			
		var rects	= (text_box.x - textIndent)+ '_' + text_box.y + '_' + text_box.w+ '_' + text_box.h;
		var rects1	= rect.x + '_' + rect.y + '_' + rect.w + '_' + rect.h+'_' + rect.sw + '_' + rect.sh + '_' + rect.cw + '_' + rect.ch;
		var rects_attr	= (text_box.x - textIndent)+ '_' + text_box.y + '_' + ((text_box.x - textIndent)+text_box.w)+ '_' + (text_box.y+text_box.h);
		utils.setAttr(extract.current, {x:(text_box.x - textIndent),y:text_box.y,w:text_box.w,h:text_box.h,rect:rects_attr,rect1:rects_attr, rect2:rects1});
	}
}
function get_area_rect(dom_obj,extract, rect){
	var parent_node	= extract.current.parentNode;
	var x		= Number(parent_node.getAttribute('x') );
	var y		= Number(parent_node.getAttribute('y') );
	return window['get_shape_'+dom_obj.getAttribute("shape")](x,y,dom_obj,rect,extract);
}
function get_shape_rect(x,y,dom_obj,rect,extract){
        var coords      = dom_obj.getAttribute('coords').split(',');
        rect.x          = x+Number(coords[0]);
        rect.y          = y+Number(coords[1]);
        rect.w          = Number(coords[2]) - Number(coords[0]);
        rect.h          = Number(coords[3]) - Number(coords[1]) ;
        return rect;
 
}

function get_shape_default(x,y,dom_obj,rect,extract){
        get_shape_rect(x,y,dom_obj,rect,extract);
}
function get_shape_circle(x,y,dom_obj,rect,extract){
        var coords      = dom_obj.getAttribute('coords').split(',');
        var r           = Number(coords[2]);
        rect.x          = x+Number(coords[0]) - r;
        rect.y          = y+Number(coords[1]) - r;
        rect.w          = r*2;
        rect.h          = r*2;
        return rect;
}
function get_shape_poly(x,y,dom_obj,rect,extract){
        var coords      = dom_obj.getAttribute('coords').split(',');
        var xmin = 0, ymin = 0, xmax = 0, ymax = 0;
        for(var ind = 0, len = coords.length; ind < len;ind++){
                var nx  = Number(coords[ind++]);
                var ny  = Number(coords[ind]);
                xmin    = (xmin < nx)?xmin:nx;
                ymin    = (ymin < ny)?ymin:ny;
                xmax    = (xmax > nx)?xmax:nx;
                ymax    = (ymax > ny)?ymax:ny;
        }
        rect.x          = x+xmin;
        rect.y          = y+ymin;
        rect.w          = xmax - xmin;
        rect.h          = ymax - ymin;
        return rect;
}

/*
 * Date		: Aug 06,2013
 * Brief	: To get Bounding rect  of html element
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function get_bounding_rect(obj) {
	var pos	= get_absolute_pos(obj);
    	return { x: pos[0], y: pos[1], w: (obj.offsetWidth || 0), h: (obj.offsetHeight || 0), sw: (obj.scrollWidth || 0), sh: (obj.scrollHeight || 0), cw: (obj.clientWidth || 0), ch: (obj.clientHeight || 0)};
}
/*
 * Date		: Aug 06,2013
 * Brief	: To get textcontent bounding rect  of html element
 * Parameters	:
 * 		@param{HTMLDOMObject} obj	=> HTML dom object
 */
function get_text_bounding_rect(dom, document_node,position,extract){
	var doc = document_node.documentElement, 
	body 	= document_node.body,
	left 	= (doc && doc.scrollLeft || body && body.scrollLeft || 0),
	top 	= (doc && doc.scrollTop  || body && body.scrollTop  || 0);
	try{
		var range = document_node.createRange();
		range.selectNodeContents(dom);
		var rect = range.getBoundingClientRect();
		return {x:rect.left + left +extract.bx,y: rect.top +top+extract.by, w:rect.right - rect.left,h: rect.bottom - rect.top};
	}catch(e){}
	return {x:left,y:top, w:0,h:0};
}
function convert_rgb_to_hash(rgb){
        return rgb.replace(/rgb\(\s*[\d\.]+\s*\,\s*[\d\.]+\s*,\s*[\d\.]+\s*\)/g, function(m){
                        var values = m.replace(/[\d\.]+/g, function(rs){
                                return parseInt(rs).toString(16).toUpperCase();
                        });
                        return values.replace(/(rgb\s*\(\s*)/,"#").replace(/[\)\,\s+]+/g,"");
                });
}

