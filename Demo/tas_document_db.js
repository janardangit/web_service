//*********************************************************************************************************************************************************
var vBatch_name = '';
var ArrtableB = [];
var ArrtableA = [];
var url_list_json = [];
var vuser_id = sessionStorage['vuser_id'];
var vuser_passwd = sessionStorage['vuser_passwd'];
//*********************************************************************************************************************************************************
$(document).ready(function()
{
	$('#docBatch').change(function()
	{
		vBatch_name = $(this).val();
		//document.getElementById('excel_path').value = vexcel_output + vBatch_name + '.xlsx';
		if(document.getElementById('tab1').className == 'menuHead active')
		{
			ArrtableB.length = 0;
			restore_tableB();
		}
	});
});
//*********************************************************************************************************************************************************
function GetDocumentPage_Details()
{
	update_user_time();
}
//*********************************************************************************************************************************************************
function GetUrlPage_Details()
{
        update_url_user_time();
}
//*********************************************************************************************************************************************************
function restore_tableA_by_colA(kuser_id)
{
	/*
	var vservice_path = vcgi_dir + 'restore_tableA/cgi_restore_tableA.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + getQuerystring('user_id');
	var strURL = vservice_path + vret_str;
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var vret = self.xmlHttpReq.responseText;
				vuser_name = Get_Str_trim(vret);
				document.getElementById('lbluser_name').innerHTML = vuser_name + '   |   ';
				restore_tableA();
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
	*/
	var user_name = {'madan':'Madan','tapas':'Tapas','pravat':'Pravat','user1':'User1'};
	document.getElementById('lbluser_name').innerHTML = user_name[kuser_id] + '   |   ';
        restore_tableA();
}
//*********************************************************************************************************************************************************
function restore_tableB_by_colC()
{
	var vservice_path = vcgi_dir + 'restore_tableB/cgi_restore_tableB_by_colC.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + vdisplay_status + ':$:'  + sessionStorage['project_id'];
	var strURL = vservice_path + vret_str;
	alert(strURL);
    	console.log(strURL);
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var vret = self.xmlHttpReq.responseText;
				var vret1 = Get_Str_trim(vret);
				var kdata_ar = eval(vret1);
				var kmain_data = kdata_ar[0].main_data;
				if (kmain_data.length > 0)
				{
					restore_tableB_by_colC_handler(kmain_data);
				}
				else
				{
					js_progress_end();
				}
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
function restore_tableB_by_colC_handler(kcolE_ar)
{
	var optPgs = '';
	for (var i=0;i<kcolE_ar.length;i++)
	{
		if(i==0)
		{
			optPgs += '<option selected="selected" value="'+kcolE_ar[i].colE+'" title="'+kcolE_ar[i].colE+'">' + kcolE_ar[i].colE + '</option>';
			if(sessionStorage['batch_name'] != '')
			{
				vBatch_name = sessionStorage['batch_name'];
			}
			else
			{
				vBatch_name = kcolE_ar[i].colE;
			}
		}
		else
		{
			optPgs += '<option value="'+kcolE_ar[i].colE+'" title="'+kcolE_ar[i].colE+'">' + kcolE_ar[i].colE + '</option>';
		}
	}
	$('#docBatch').html(optPgs);
    restore_tableB();
}
//*********************************************************************************************************************************************************
function restore_tableB()
{
	js_progress_start();
	var vservice_path = vcgi_dir + 'restore_tableB/cgi_restore_tableB.py?inp_detail=';
	/*if(sessionStorage['batch_name'] !='')
	{
		document.getElementById('docBatch').value = vBatch_name;
		sessionStorage['batch_name'] = '';
	}*/
	var vret_str = vdb_name + ':$:' + vdisplay_status + ':$:'  + sessionStorage['project_id'];
	var strURL = vservice_path + vret_str;
	//alert(strURL);
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var vret = self.xmlHttpReq.responseText;
				var vret1 = Get_Str_trim(vret);
				ArrtableB.length = 0;
				var vtmp_ar = eval(vret1);
				if (vtmp_ar == undefined)
				{
					js_progress_end();
					return;
				}
				ArrtableB = vtmp_ar[0].main_data;
				restore_tableB_grid();
			}
			else
			{
				js_progress_end();
				alert("2 ---------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send( params );
}
//*********************************************************************************************************************************************************
function update_tableA_colD()
{
	var vservice_path = vcgi_dir + 'restore_tableA/cgi_update_tableA_colD.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + getQuerystring('user_id');
	var strURL = vservice_path + vret_str;
	//alert(strURL);
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if (self.xmlHttpReq.status == 200)
			{
				window.location.href = 'login.html';
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params) ;
}
//*********************************************************************************************************************************************************
function getColor_tableB(krow)
{
	var row_len = document.getElementById("dg_tableB").rows.length - 1;
	var numCols = $("#dg_tableB").find('tr')[0].cells.length;
	for(var i=0;i<row_len;i++)
	{
		var rows = (i+1).toString();
		var vcss_typ='';
		if(i+1==krow)
		{
			vcss_typ = "table_cells";
		}
		else
		{
			vcss_typ ="table_cells";
		}
		for(var j=0;j<numCols;j++)
		{
			document.getElementById(rows+'_D'+(j+1).toString()).className = vcss_typ;
		}
	}
}
//*********************************************************************************************************************************************************
function Go_To_HtmlPage(row_cnt_t)
{
	sessionStorage['colX'] = row_cnt_t.split('_')[0];
	sessionStorage['colY'] = row_cnt_t.split('_')[1];
	sessionStorage['colZ'] = row_cnt_t.split('_')[2];
	sessionStorage['colW'] = row_cnt_t.split('_')[3];
	sessionStorage['colV'] = parseInt(row_cnt_t.split('_')[4]);
    //alert(sessionStorage['colV'] )
	window.location.replace('html_view.html?user_id='+getQuerystring('user_id'));
}
//*********************************************************************************************************************************************************
function update_user_time()
{
	/*
	var vservice_path = vcgi_dir + 'restore_tableA/cgi_logout_user1.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + getQuerystring('user_id') + ':$: :$:' + sessionStorage['unique_key'] + ':$:2:$: ';
	var strURL = vservice_path + vret_str;
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var vret = self.xmlHttpReq.responseText;
				var vret1 = Get_Str_trim(vret);
				if(vret1 == 'DONE')
				{
					restore_tableA_by_colA(getQuerystring('user_id'));
				}
				else if(vret1 == 'User Already Logged In Another Machine')
				{
					alert(vret1);
					window.location.href = 'login.html';
				}
				else
				{
					window.location.href = 'login.html';
				}
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
	*/
	if(sessionStorage.vuser_id == ''){
		window.location.href = 'login.html';
	}else{
		restore_tableA_by_colA(getQuerystring('user_id'));
	}
}
//*********************************************************************************************************************************************************
function restore_tableB_grid()
{
	if (getQuerystring('user_id')!=null)
	{
		clear_grid_data('dg_tableB');
		var newTbody_h = document.createElement('tbody');
		var vheader_ar = ['','SL No.', 'Agent Id' , 'User ID' , 'Mgmt id'  , 'Total Documents', 'Process date', 'Review'];
		newRow = document.createElement('tr');
		newRow.setAttribute('class', 'table-header-row');
		for(var i=0;i<vheader_ar.length;i++)
		{
			var newCol = document.createElement('th');
			newCol.setAttribute('class','table_header');
			if (i == 0)
			{
				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.setAttribute('id','selecctall');
				checkbox.setAttribute('class','checkbox');
				checkbox.onclick = function(evt)
				{
					check_all();
				}
				newCol.appendChild(checkbox);
				newRow.appendChild(newCol);	
			}
			else
			{
				
				//newCol.setAttribute('align', 'center');
				//newCol.setAttribute('valign', 'middle');
				//newCol.style.height = "27px";
				//newCol.style.borderRight = "1px solid #ffffff";
				//newCol.style.color = "#3e3e3e";
				newCol.innerHTML = vheader_ar[i];
				newRow.appendChild(newCol);
			}
		}
		newTbody_h.appendChild(newRow);

		var tr_count = 0;
		for (var i=0;i<ArrtableB.length;i++)
		{
			
			tr_count = tr_count + 1;
			var newRow = document.createElement('tr');
			newRow.id = tr_count;
			newRow.onclick = function(evt)
			{
				getColor_tableB(this.id);
			}
			for(var j=0;j<vheader_ar.length;j++)
			{
				newCol = document.createElement('td');
				newCol.setAttribute('id', ''+tr_count+'_D'+(j+1));
				if (j == 0)
				{
					newCol.setAttribute('align', 'center');
					var checkbox = document.createElement("input");
                                	checkbox.type = "checkbox";
                                        checkbox.setAttribute('class','checkbox1');
					checkbox.setAttribute('name','case[]');
					checkbox.setAttribute('id','checkbox1');	
					newCol.appendChild(checkbox);
				}
				else if(j == 1)
				{
					newCol.setAttribute('class', 'table_cells');
					newCol.setAttribute('align', 'center');
					newCol.innerHTML = tr_count;
				}
                                else if(j == 2)
                                {
                                        newCol.setAttribute('align', 'center');
					//newCol.setAttribute('id','agent_id');
                                        newCol.innerHTML = ArrtableB[i].bm_col1;
                                }
				else if (j == 3)
				{
					newCol.setAttribute('class', 'table_cells');
					newCol.setAttribute('align', 'center');
                                        newCol.innerHTML = ArrtableB[i].bm_col2;
				}
				else if (j == 4)
                                {
					newCol.setAttribute('class', 'table_cells');
                                        newCol.setAttribute('align', 'center');
                                        newCol.innerHTML = ArrtableB[i].bm_col3;
                                }	
                                else if(j == 5)
                                {
					newCol.setAttribute('class', 'table_cells');
                                        newCol.setAttribute('align', 'center');
                                        newCol.innerHTML = ArrtableB[i].bm_col4;
                                }
				else if(j == 6)
				{
					newCol.setAttribute('class', 'table_cells');
                                        newCol.setAttribute('align', 'center');
                                        newCol.innerHTML = ArrtableB[i].bm_col6;
				}	
				else
				{
					newCol.setAttribute('class', 'table_cells');
					newCol.setAttribute('align', 'center');
					var reviewImg = document.createElement('img');
					reviewImg.id = ArrtableB[i].bm_col7;
					//alert(ArrtableB[i].bm_col6);
					reviewImg.setAttribute('src', 'icons/right.png');
					reviewImg.onclick = function(evt)
					{
						Go_To_HtmlPage(this.id);
					}
					reviewImg.style.cursor = 'pointer';
					newCol.appendChild(reviewImg);
				}
				newRow.appendChild(newCol);
			}
			newTbody_h.appendChild(newRow);
		}
		document.getElementById('dg_tableB').appendChild(newTbody_h);
		getColor_tableB('1');
		js_progress_end();
	}
	else
	{
		Go_To_Login();
	}
}

//*********************************************************************************************************************************************************
function select_deselect_all(){
	ids = [];
        if (document.getElementById("selecctall").checked)
        {
                var x = document.getElementsByName("url_id");
                for (var i=0;i<x.length;i++)
                {
                        x[i].checked = true;
			//alert(x[i].id);
			ids.push(x[i].id);
                }
        }
        else
        {
                var x = document.getElementsByName("url_id");
                for (var i=0;i<x.length;i++)
                {
                        x[i].checked = false;
                }

        }

}

//*************************************************************************************************************************************************
function check_all()
{
	if (document.getElementById("selecctall").checked)
	{
		var x = document.querySelectorAll(".checkbox1");
		for (var i=0;i<x.length;i++)
		{
			x[i].checked = true;
		}
	}
	else
	{
		var x = document.querySelectorAll(".checkbox1");
                for (var i=0;i<x.length;i++)
                {
                        x[i].checked = false;
                }

	}
}

//************************************************************************************************************************************************/
function show_dashboard(){
	document.getElementById('dashboard').style.display = "none";
	document.getElementById('download_xls').style.display = "none";
	document.getElementById('download_all').style.display = "none";
	document.getElementById('send_mail_popup').style.display = "none";
	document.getElementById('send_mail_div').style.display = "none";
	document.getElementById('response_type').style.display = "none";
	document.getElementById('select_all').style.display = "none";
	//document.getElementById('send_mail').style.display = "none";
	document.getElementById('batch_select').style.display = "none";
	document.getElementById('process_url').style.display = "none";
	document.getElementById('processed').style.display = "block";
	document.getElementById('download_report').style.display = "block";
	document.getElementById('div_process').style.display = "none";
	document.getElementById('div_report_sec').style.display = "block";
	document.getElementById('cs_logout').style.margin = "0px 0px 0px 0px";
	fill_dashboard_table();
}

function show_processed(){
	document.getElementById('dashboard').style.display = "block";
	document.getElementById('download_xls').style.display = "block";
	document.getElementById('download_all').style.display = "block";
	document.getElementById('response_type').style.display = "block";
	//document.getElementById('send_mail').style.display = "block";
	document.getElementById('send_mail_popup').style.display = "block";
	document.getElementById('select_all').style.display = "block";
	document.getElementById('send_mail_div').style.display = "none";
	document.getElementById('process_url').style.display = "block";
	document.getElementById('download_report').style.display = "none";
	document.getElementById('batch_select').style.display = "";
	document.getElementById('processed').style.display = "none";
	document.getElementById('div_process').style.display = "block";
	document.getElementById('div_report_sec').style.display = "none";
	document.getElementById('cs_logout').style.margin = "-22px 5px 0px 0px";

}

//***********************************************************************************************************************************************/
function process_all_url(){
	document.getElementById('url_process_img').style.display = 'block';
	var table_name = document.getElementById('batch_select').value;
	//console.log('======>'+ids);return;
	var json_data = {'table_name':table_name,'ids':ids}
	//var vservice_path = vcgi_dir + 'change_detection/cgi_get_url_details_new.py?input_str='+JSON.stringify(json_data);
	var vservice_path = vcgi_dir + 'change_detection/cgi_process_table_url.py?input_str='+JSON.stringify(json_data);
	console.log('>>>>'+vservice_path);
	var strURL = vservice_path;
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var text = self.xmlHttpReq.responseText;
				try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){console.log("Error JSON.parse "+e);}
				document.getElementById('url_process_img').style.display = 'none';
				alert('DONE');
				//filter_data_response();
				document.getElementById('response_type').value = 'all';
				window.location.reload();
				//document.getElementById('batch_select').value = table_name;
				//document.getElementById(sessionStorage.scroll_row).parentNode.parentNode.scrollIntoView();
				//capture_all_urls(json);
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);


}
//************************************************************************************************************************************************/
function send_mail_popup(){
	document.getElementById('send_mail_div').style.display = 'block';
}

function hide_send_mail_div(){
	document.getElementById('send_mail_div').style.display = 'none';
}

function mail_action(){
  	var doc_arr = [];
	var emailid_arr = []
	var cboxes = document.getElementsByName('doc_name[]');
    	var len = cboxes.length;
    	for (var i=0; i<len; i++) {
		if(cboxes[i].checked){
           		doc_arr.push(cboxes[i].value);
      		}
    	}
	var cboxes = document.getElementsByName('mailId[]');
	var len = cboxes.length;
        for (var i=0; i<len; i++) {
                if(cboxes[i].checked){
                        emailid_arr.push(cboxes[i].value);
                }
        }
	if(doc_arr.length == 0){
		alert('please select atleast one category');
		return false;
	}
	if(emailid_arr == 0){
		alert('please select atleast one recipient');
		return false;
	}
	document.getElementById('send_mail_div').style.display = 'none';
  	document.getElementById('url_process_img').style.display = 'block';
	var json_data = {'doc_list':doc_arr,'email_list':emailid_arr};
	var vservice_path = vcgi_dir + 'change_detection/cgi_send_mail_process.py?input_str='+JSON.stringify(json_data);
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
  				document.getElementById('url_process_img').style.display = 'none';
				alert('Mail has been sent successfully.');
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);
	
} 
//************************************************************************************************************************************************/
function capture_all_urls(url_list_arr){
	//js_progress_end();
        if (getQuerystring('user_id')!=null)
        {
		var list_of_urls = url_list_arr.data;
		var url_arr = [];
		for(var i=0;i<list_of_urls.length;i++){
			url_arr.push(list_of_urls[i][1]);
		}
		//console.log("==========>>>"+url_arr);

		
        }
        else
        {
                Go_To_Login();
        }

}
//************************************************************************************************************************************************/
function download_all_result(){
	document.getElementById('url_process_img').style.display = 'block';
	var vservice_path = vcgi_dir + 'change_detection/cgi_download_all.py';
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
				download_mail_report();
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);

}

//************************************************************************************************************************************************/
function send_mail(){
 	var vservice_path = vcgi_dir + 'change_detection/cgi_send_mail.py';
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
				document.getElementById('url_process_img').style.display = 'none';
				alert('Mail has been sent successfully...');
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);
	
}
//************************************************************************************************************************************************/
function download_mail_report(){
	var vservice_path = vcgi_dir + 'change_detection/cgi_download_report.py';
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
				send_mail();
				
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);

}
//************************************************************************************************************************************************/
function download_all(){
	document.getElementById('url_process_img').style.display = 'block';
	var vservice_path = vcgi_dir + 'change_detection/cgi_download_all.py';
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
				document.getElementById('url_process_img').style.display = 'none';
			 	window.open('http://172.16.20.235/'+text, "_blank", "");	
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);

}
//************************************************************************************************************************************************/
function download_report(){
	//alert('download report called');return;
	var vservice_path = vcgi_dir + 'change_detection/cgi_download_report.py';
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
			 	window.open('http://172.16.20.235/'+text, "_blank", "");	
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);

}
//************************************************************************************************************************************************/
function download_xls(){
	var batch_name = document.getElementById('batch_select').value;
	//alert(batch_name);
	//return;
	var json_data = {'table_name':batch_name}
        var vservice_path = vcgi_dir + 'change_detection/cgi_download_xls.py?input_str='+JSON.stringify(json_data);
        var strURL = vservice_path;
	console.log('===========>'+strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var text = self.xmlHttpReq.responseText;
			 	window.open('http://172.16.20.235/'+text, "_blank", "");	
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);

}   
//************************************************************************************************************************************************/
function show_data(){
	document.getElementById("selecctall").checked = false;
	var table_name = document.getElementById('batch_select').value;
	document.getElementById('response_type').value = 'all';
	sessionStorage['scroll_row'] = 0;
	ids = [];
	js_progress_start();
	url_details(table_name);
} 
//*********************************************************************************************************************************************************
function url_details(table_name){
	var json_data = {'table_name':table_name}
	//var json_data = {'table_name':'url_master'}
	var vservice_path = vcgi_dir + 'change_detection/cgi_get_url_list.py?input_str='+JSON.stringify(json_data);
	var strURL = vservice_path;
	//send_ajax_request(strURL, null, 1,"restore_tableA_grid(json)", "GET", true);return;
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var text = self.xmlHttpReq.responseText;
				try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){console.log("Error JSON.parse "+e);}
				url_list_json = json;
				restore_tableA_grid(json);
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);

} 
//***********************************************************************************************************************************************
function fill_dashboard_table(){
	//var json_data = {'table_name':'url_master'}
	var vservice_path = vcgi_dir + 'change_detection/cgi_get_url_report.py';
	var strURL = vservice_path;
	console.log('========>'+strURL);
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var text = self.xmlHttpReq.responseText;
				try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){console.log("Error JSON.parse "+e);}
				restore_dg_tableB(json);
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);


}
//***********************************************************************************************************************************************
function open_url(url){
	window.open(url, "_blank", "");
}

//************************************************************************************************************************************************
function restore_dg_tableB(url_report_arr){
	js_progress_end();
        if (getQuerystring('user_id')!=null)
        {
                clear_grid_data('dg_tableB');
                //var newTbody_h = document.createElement('tbody');
                var newTbody_h = document.getElementById('dg_tableB');
                var vheader_ar = ['SL No.', 'Practice Area','No. of links', 'Success', 'Fail' ,'Redirect (other)','Redirect (login)','Login (Lexis)','Success %','Fail %','Redirect (other) %','Redirect (login) %','Login (Lexis) %'];
                newRow = document.createElement('tr');
                newRow.setAttribute('class', 'table-header-row');
                for(var i=0;i<vheader_ar.length;i++)
                {
                        var newCol = document.createElement('th');
			newCol.setAttribute('class','table_header');
			if(i == 0){
				newCol.style.width = '3.5%';
				newCol.style.textAlign = 'center';
			}else if(i == 1){
				newCol.style.width = '9.2%';
			}
			if(i > 1){
				newCol.style.width = '7%';
				newCol.style.textAlign = 'center';
			}
                        newCol.innerHTML = vheader_ar[i];
                        newRow.appendChild(newCol);
                }
                newTbody_h.appendChild(newRow);
		console.log('========='+url_report_arr)
		var list_of_urls = url_report_arr.data;
		var practice_area = ['Banking and Finance','Business Law','California Business Entity Selection and Formation','Combined Bus Entity Selection','Commercial Bankrtupcy','Corporate Counsel','Intellectual Property','Labor & Employment','M&A','NY Business and Commercial','Real Estate','Securities and Capital Markets','Texas Business & Commercial'];	
		//var practice_area = ['Banking and Finance','Business Law','California Business Entity Selection and Formation','Combined California -General Business Law','Commercial Bankrtupcy','Intellectual Property','M&A','NY Business and Commercial','Real Estate'];	
		for(var i=0;i<list_of_urls.length;i++){
			newRow = document.createElement('tr');
			newRow.setAttribute('class', '');
			for(var j=0;j<list_of_urls[i].length;j++){
				var newCol = document.createElement('td');
				newCol.setAttribute('class','table_cells');
				if(j == 0){
                                	newCol.style.width = '3%';
					newCol.style.textAlign = 'center';
                        	}else if(j == 1){
                                	newCol.style.width = '8%';
					list_of_urls[i][j] = practice_area[i];
                        	}
				if(j > 1){
					newCol.style.width = '7%';
					newCol.style.textAlign = 'center';
				}
				if(j > 7){
					list_of_urls[i][j] = list_of_urls[i][j]+'%';
				}

				newCol.innerHTML = list_of_urls[i][j];
				newRow.appendChild(newCol);
			}
			newTbody_h.appendChild(newRow);
			
		}
		
                //getColor_tableA('1');
		get_fail_report_table();
        }
        else
        {
                Go_To_Login();
        }


}
//*********************************************************************************************************************************************
function send_ajax_request(strURL,post_data,succ_flag,callback,request_type,asyn){
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var text = self.xmlHttpReq.responseText;
				try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){console.log("Error JSON.parse "+e);}
				var callfunc    = eval(callback);	
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open(request_type, strURL, asyn);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = post_data;
	self.xmlHttpReq.send(params);

}
//*********************************************************************************************************************************************
function get_fail_report_table(){
	var vservice_path = vcgi_dir + 'change_detection/cgi_get_url_fail_report.py';
	var strURL = vservice_path;
	console.log('========>'+strURL);
	var xmlHttpReq = false;
	var self = this;
	if (window.XMLHttpRequest)
	{
		self.xmlHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.onreadystatechange = function()
	{
		if (self.xmlHttpReq.readyState == 4)
		{
			if ( self.xmlHttpReq.status == 200 )
			{
				var text = self.xmlHttpReq.responseText;
				try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){console.log("Error JSON.parse "+e);}
				fill_fail_report_table(json);
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);

}
//***********************************************************************************************************************************************
function fill_fail_report_table(url_report_arr){
		clear_grid_data('dg_tableB_2');
                //var newTbody_h = document.createElement('tbody');
                var newTbody_h = document.getElementById('dg_tableB_2');
		var vmain_header_ar = ['','','Number of Links','','Failed Link % (shaded red if > 2.0%)'];
                newRow = document.createElement('tr');
                newRow.setAttribute('class', 'table-header-row');
                for(var j=0;j<vmain_header_ar.length;j++){
                        var newCol = document.createElement('th');
                        newCol.setAttribute('class','table_header');
                        if(j == 0){
                                newCol.style.width = '2%';
                        }else if(j == 1){
                                newCol.style.width = '8%';
                        }else{
                                newCol.style.width = '7%';
                        }
			if(j == 2){
                                newCol.style.textAlign = 'center';
                                newCol.colSpan = 6;
                        }
                        if(j == 4){
                                newCol.style.textAlign = 'center';
                                newCol.colSpan = 6;
                        }


                        newCol.innerHTML = vmain_header_ar[j];
                        newRow.appendChild(newCol);


                }
                newTbody_h.appendChild(newRow);


                var vheader_ar = ['SL No.', 'Practice Area','18-may-15', '25-may-15', '1-june-15' ,'8-june-15','15-june-15','22-june-15','','18-may-15','25-may-15','1-june-15','8-june-15','15-june-15','22-june-15'];
                newRow = document.createElement('tr');
                newRow.setAttribute('class', 'table-header-row');
                for(var i=0;i<vheader_ar.length;i++)
                {
                        var newCol = document.createElement('th');
			newCol.setAttribute('class','table_header');
			if(i == 0){
				newCol.style.width = '3%';
				newCol.style.textAlign = 'center';
			}else if(i == 1){
				newCol.style.width = '8%';
			}
			if(i > 1){
				newCol.style.width = '7%';
				newCol.style.textAlign = 'center';
			}
                        newCol.innerHTML = vheader_ar[i];
                        newRow.appendChild(newCol);
                }
                newTbody_h.appendChild(newRow);
		var list_of_urls = url_report_arr.data;
		var practice_area = ['Banking and Finance','Business Law','California Business Entity Selection and Formation','Combined Bus Entity Selection','Commercial Bankrtupcy','Corporate Counsel','Intellectual Property','Labor & Employment','M&A','NY Business and Commercial','Real Estate','Securities and Capital Markets','Texas Business & Commercial'];
		for(var i=0;i<practice_area.length;i++){
                        newRow = document.createElement('tr');
                        newRow.setAttribute('class', '');
                        for(var j=0;j<list_of_urls[i].length;j++){
                                var newCol = document.createElement('td');
                                newCol.setAttribute('class','table_cells');
				var value;
                                if(j == 0){
                                        newCol.style.width = '3%';
                                        newCol.style.textAlign = 'center';
					value = list_of_urls[i][j];
                                }else if(j == 1){
                                        newCol.style.width = '8%';
                                        //list_of_urls[i][j] = practice_area[i];
                                        value = practice_area[i];
                                }
                                if(j > 1 && j< 9){
                                        newCol.style.width = '7%';
                                        newCol.style.textAlign = 'center';
					value = list_of_urls[i][j];
                                }
				if(j > 8 && j < 15){
                                        newCol.style.width = '7%';
                                        newCol.style.textAlign = 'center';
					if(list_of_urls[i][j] > 2){
						newCol.style.backgroundColor = '#ffdfdf';
						newCol.style.color = '#ff0000';
					}
                                       	value = list_of_urls[i][j]+'%';
                                }
				if(j > 14){
                                        newCol.style.width = '7%';
                                        newCol.style.textAlign = 'center';
                                        value = list_of_urls[i][j];
                                }



                                //newCol.innerHTML = list_of_urls[i][j];
                                newCol.innerHTML = value;
                                newRow.appendChild(newCol);
                        }
                        newTbody_h.appendChild(newRow);

                }

		return;

}
//************************************************************************************************************************************************
function filter_data_response(){
	document.getElementById("selecctall").checked = false; 
	var response_type = document.getElementById('response_type').value;
	var url_list_data = url_list_json;
        js_progress_start();
        if (getQuerystring('user_id')!=null)
        {
                //clear_grid_data('dg_tableA');
                //var newTbody_h = document.createElement('tbody');
                document.getElementById('dg_tableA').innerHTML = '';
                var newTbody_h = document.getElementById('dg_tableA');
                var vheader_ar = ['SL No.', 'External Link Label', 'Topic Tree Location', 'External Link Address' ,'Response Category','Ping Date Time','New URL (Redirect - Other only)'];
                newRow = document.createElement('tr');
                newRow.setAttribute('class', 'table-header-row');
                for(var i=0;i<vheader_ar.length;i++)
                {
                        var newCol = document.createElement('th');
			newCol.setAttribute('class','table_header');
			if(i == 0){
				newCol.style.width = '5%';
				newCol.style.textAlign = 'center';
			}else if(i == 1){
				newCol.style.width = '20%';
			}else if(i == 2){
				newCol.style.width = '20%';
			}else if(i == 3){
				newCol.style.width = '20%';
			}else if(i == 4){	
				newCol.style.width = '5%';
				newCol.style.textAlign = 'center';
                        }else if(i == 5){
				newCol.style.width = '10%';
                        }else if(i == 6){
				newCol.style.width = '20%';
                        }
                        newCol.innerHTML = vheader_ar[i];
                        newRow.appendChild(newCol);
                }
                newTbody_h.appendChild(newRow);
		console.log('========='+url_list_data)
		var list_of_urls = url_list_data.data;
		//var list_of_urls = url_list;
		
		for(var i=0;i<list_of_urls.length;i++){
			if(list_of_urls[i][4] != response_type && response_type != 'all')
				continue;
			newRow = document.createElement('tr');
			newRow.setAttribute('class', '');
			for(var j=0;j<list_of_urls[i].length;j++){
				var newCol = document.createElement('td');
				newCol.setAttribute('class','table_cells');
				if(j == 0){
					newCol.style.width = '5%';
					newCol.style.textAlign = 'center';
					//list_of_urls[i][j] = '<input type="checkbox" id="'+list_of_urls[i][j]+'" onclick="store_id(this);" value="'+list_of_urls[i][j]+'" name="url_id"> '+list_of_urls[i][j];
				}else if(j == 1){
					newCol.style.width = '20%';
				}else if(j == 2){
					newCol.style.width = '20%';
				}else if(j == 3){
					newCol.style.width = '20%';
					newCol.setAttribute('title',list_of_urls[i][j]);
					newCol.setAttribute('onclick',"open_url('"+list_of_urls[i][j]+"');");
					//if(list_of_urls[i][j].length > 70)
						//list_of_urls[i][j] = list_of_urls[i][j].substring(0, 70);
				}else if(j == 4){	
					newCol.style.width = '10%';
					newCol.style.textAlign = 'center';
                                }else if(j == 5){
					newCol.style.width = '5%';
                                }else if(j == 6){
					newCol.style.width = '20%';
					if(list_of_urls[i][j] != ''){
						newCol.setAttribute('title',list_of_urls[i][j]);
						newCol.setAttribute('onclick',"open_url('"+list_of_urls[i][j]+"');");
						//if(list_of_urls[i][j].length > 70)
							//list_of_urls[i][j] = list_of_urls[i][j].substring(0, 70);
					}
                                }
				newCol.innerHTML = list_of_urls[i][j];
				newRow.appendChild(newCol);
			}
			newTbody_h.appendChild(newRow);
			
		}
		js_progress_end();
		if(sessionStorage.scroll_row != 0)
			document.getElementById(sessionStorage.scroll_row).parentNode.parentNode.scrollIntoView();	
		else
			document.getElementById("div_process").scrollTop = 0;
                 
		//document.getElementById('dg_tableA').appendChild(newTbody_h);
                //getColor_tableA('1');
                //js_progress_end();
        }
        else
        {
                Go_To_Login();
        }

}
//************************************************************************************************************************************************
function restore_tableA_grid(url_list_arr)
{
	js_progress_end();
	//url_list = url_list_arr.data;
        if (getQuerystring('user_id')!=null)
        {
                //clear_grid_data('dg_tableA');
                //var newTbody_h = document.createElement('tbody');
                document.getElementById('dg_tableA').innerHTML = '';
                var newTbody_h = document.getElementById('dg_tableA');
                var vheader_ar = ['SL No.', 'External Link Label', 'Topic Tree Location', 'External Link Address' ,'Response Category','Ping Date Time','New URL (Redirect - Other only)'];
                newRow = document.createElement('tr');
                newRow.setAttribute('class', 'table-header-row');
                for(var i=0;i<vheader_ar.length;i++)
                {
                        var newCol = document.createElement('th');
			newCol.setAttribute('class','table_header');
			if(i == 0){
				newCol.style.width = '5%';
				newCol.style.textAlign = 'center';
			}else if(i == 1){
				newCol.style.width = '20%';
			}else if(i == 2){
				newCol.style.width = '20%';
			}else if(i == 3){
				newCol.style.width = '20%';
			}else if(i == 4){	
				newCol.style.width = '5%';
				newCol.style.textAlign = 'center';
                        }else if(i == 5){
				newCol.style.width = '10%';
                        }else if(i == 6){
				newCol.style.width = '20%';
                        }
                        newCol.innerHTML = vheader_ar[i];
                        newRow.appendChild(newCol);
                }
                newTbody_h.appendChild(newRow);
		console.log('========='+url_list_arr)
		var list_of_urls = url_list_arr.data;
		
		for(var i=0;i<list_of_urls.length;i++){
			newRow = document.createElement('tr');
			newRow.setAttribute('class', '');
			for(var j=0;j<list_of_urls[i].length;j++){
				var newCol = document.createElement('td');
				newCol.setAttribute('class','table_cells');
				if(j == 0){
					newCol.style.width = '5%';
					newCol.style.textAlign = 'center';
					list_of_urls[i][j] = '<input type="checkbox" id="'+list_of_urls[i][j]+'" onclick="store_id(this);" value="'+list_of_urls[i][j]+'" name="url_id"> '+list_of_urls[i][j];
				}else if(j == 1){
					newCol.style.width = '20%';
				}else if(j == 2){
					newCol.style.width = '20%';
				}else if(j == 3){
					newCol.style.width = '20%';
					newCol.setAttribute('title',list_of_urls[i][j]);
					newCol.setAttribute('onclick',"open_url('"+list_of_urls[i][j]+"');");
					//if(list_of_urls[i][j].length > 70)
						//list_of_urls[i][j] = list_of_urls[i][j].substring(0, 70);
				}else if(j == 4){	
					newCol.style.width = '10%';
					newCol.style.textAlign = 'center';
                                }else if(j == 5){
					newCol.style.width = '5%';
                                }else if(j == 6){
					newCol.style.width = '20%';
					if(list_of_urls[i][j] != ''){
						newCol.setAttribute('title',list_of_urls[i][j]);
						newCol.setAttribute('onclick',"open_url('"+list_of_urls[i][j]+"');");
						//if(list_of_urls[i][j].length > 70)
							//list_of_urls[i][j] = list_of_urls[i][j].substring(0, 70);
					}
                                }
				newCol.innerHTML = list_of_urls[i][j];
				newRow.appendChild(newCol);
			}
			newTbody_h.appendChild(newRow);
			
		}
		if(sessionStorage.scroll_row != 0)
			document.getElementById(sessionStorage.scroll_row).parentNode.parentNode.scrollIntoView();	
		else
			document.getElementById("div_process").scrollTop = 0;
                 
		//document.getElementById('dg_tableA').appendChild(newTbody_h);
                //getColor_tableA('1');
                //js_progress_end();
        }
        else
        {
                Go_To_Login();
        }
}

var ids = [];
function store_id(obj){
	sessionStorage['scroll_row'] = obj.id;
        if(obj.checked){
                ids.push(obj.id);
        }else{
                var i = ids.indexOf(obj.id);
                if(i != -1) {
                        ids.splice(i, 1);
                }
        }
        console.log(ids);
        return;
}

//*********************************************************************************************************************************************************

function restore_tableA()
{
	
        js_progress_start();
	//restore_tableA_grid();
	var table_name = document.getElementById('batch_select').value;
	url_details(table_name);
	/*
        var vservice_path = vcgi_dir + 'restore_tableA/cgi_case_project_details.py';
        var strURL = vservice_path ;
        //alert(strURL);
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var vret = self.xmlHttpReq.responseText;
                                ArrtableA.length = 0;
                                var vtmp_ar = eval(vret);
                                if (vtmp_ar == undefined)
                                {
                                        js_progress_end();
                                        return;
                                }
                                ArrtableA = vtmp_ar;
                                restore_tableA_grid();
                        }
                        else
                        {
				js_progress_end();
                                alert("2 ---------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send( params );
	*/
}

//*********************************************************************************************************************************************************

function getColor_tableA(krow)
{
        var row_len = document.getElementById("dg_tableA").rows.length - 1;
        var numCols = $("#dg_tableA").find('tr')[0].cells.length;
        for(var i=0;i<row_len;i++)
        {
                var rows = (i+1).toString();
                var vcss_typ='';
                if(i+1==krow)
                {
                        vcss_typ = "table_cells";
                }
                else
                {
                        vcss_typ ="table_cells";
                }
                for(var j=0;j<numCols;j++)
                {
                        document.getElementById(rows+'_D'+(j+1).toString()).className = vcss_typ;
                }
        }
}

//*********************************************************************************************************************************************************

function restore_tableB_by_colA(kuser_id)
{
        var vservice_path = vcgi_dir + 'restore_tableA/cgi_restore_tableA.py?inp_detail=';
        var vret_str = vdb_name + ':$:' + getQuerystring('user_id');
        var strURL = vservice_path + vret_str;
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var vret = self.xmlHttpReq.responseText;
                                vuser_name = Get_Str_trim(vret);
                                document.getElementById('lbluser_name').innerHTML = vuser_name + '   |   ';
                                //restore_tableB_by_colC();
                                restore_tableB();
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
        }
        self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);
}

//*********************************************************************************************************************************************************
function update_url_user_time()
{
        var vservice_path = vcgi_dir + 'restore_tableA/cgi_logout_user1.py?inp_detail=';
        var vret_str = vdb_name + ':$:' + getQuerystring('user_id') + ':$: :$:' + sessionStorage['unique_key'] + ':$:2:$: ';
        var strURL = vservice_path + vret_str;
        var xmlHttpReq = false;
        var self = this;
        if (window.XMLHttpRequest)
        {
                self.xmlHttpReq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
                self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.onreadystatechange = function()
        {
                if (self.xmlHttpReq.readyState == 4)
                {
                        if ( self.xmlHttpReq.status == 200 )
                        {
                                var vret = self.xmlHttpReq.responseText;
                                var vret1 = Get_Str_trim(vret);
                                if(vret1 == 'DONE')
                                {
					$('#casename').html(sessionStorage['caseName']);
                                        restore_tableB_by_colA(getQuerystring('user_id'));
                                }
                                else if(vret1 == 'User Already Logged In Another Machine')
                                {
                                        alert(vret1);
                                        window.location.href = 'login.html';
                                }
                                else
                                {
                                        window.location.href = 'login.html';
                                }
                        }
                        else
                        {
                                alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        }
                }
	}
	self.xmlHttpReq.open('GET', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        params = '';
        self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************

function new_call_cgi_generate_report()
{
	var agent_id_arr = new Array();
	var agent_id_str = ''
	var user_id = ''
	var mgmt_id = ''
	var x = document.querySelectorAll(".checkbox1");
	for (var i = 0; i<x.length;i++)
	{
		if (x[i].checked == true)
		{
			agent_id_arr.push(x[i].parentNode.parentNode.cells[2].textContent);
			user_id = x[i].parentNode.parentNode.cells[3].textContent.toString();
			mgmt_id = x[i].parentNode.parentNode.cells[4].textContent.toString();       	
    		}
	}
	if (agent_id_arr.length == 0){
		alert("Please select any checkbox");
	}
	else
	{
		js_progress_start();
		agent_id_str = agent_id_arr.join("_");
		var vservice_path = vcgi_dir + 'restore_tableB/cgi_generate_excel.py?inp_detail=';
     		var vret_str = sessionStorage['project_id'] + ':$:' + user_id + ':$:' + mgmt_id + ':$:' + agent_id_str + ':$:' + sessionStorage['vuser_id'];
        	var strURL = vservice_path + vret_str;
        	var xmlHttpReq = false;
		//alert(strURL);
        	var self = this;
        	if (window.XMLHttpRequest)
        	{
                	self.xmlHttpReq = new XMLHttpRequest();
        	}
        	else if (window.ActiveXObject)
        	{
                	self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        	}
        	self.xmlHttpReq.onreadystatechange = function()
        	{
                	if (self.xmlHttpReq.readyState == 4)
                	{
                        	if ( self.xmlHttpReq.status == 200 )
                        	{
                                	var vret = self.xmlHttpReq.responseText;
                                	var vret1 = Get_Str_trim(vret);
					vret1 = eval(vret1);
					//alert(vret1);
                                	if(vret1[0].zip_file_path)
                                	{
						js_progress_end();
						sessionStorage['zip_path'] = vret1[0].zip_file_path;
						alert("Report Generated Successfully.");
                                	}
					else
					{
						js_progress_end();
						alert("Problem in Generating Report");
					
					}
                        	}      
                        	else
                        	{
                                	alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                        	}
                	}	
        	}
		self.xmlHttpReq.open('GET', strURL, true);
        	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        	params = '';
        	self.xmlHttpReq.send(params);
	}
}

//*********************************************************************************************************************************************************

function new_download_report()
{
	var newPath = "http://192.168.2.211/" + sessionStorage['zip_path'].slice(13,sessionStorage['zip_path'].length+1);
	//alert(newPath);
	window.open(newPath);
}
