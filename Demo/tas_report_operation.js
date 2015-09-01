//*********************************************************************************************************************************************************
var vbatch_nameR = '';
var vdoc_option = 'All';
//*********************************************************************************************************************************************************
function call_cgi_restore_tableR()
{
	var vservice_path = vcgi_dir + 'restore_tableG/cgi_restore_tableG.py?inp_detail=';
	var vret_str = vdb_name;
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
			if (self.xmlHttpReq.status == 200)
			{
				var vret = self.xmlHttpReq.responseText;
				var vret1 = Get_Str_trim(vret);
				var kdata_ar = eval(vret1);
				var ktable_str = kdata_ar[0].table_str;
				document.getElementById('div_tableB_report').innerHTML = ktable_str;
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
function call_cgi_generate_report(e)
{
	if(vbatch_nameR == '')
	{
		document.getElementById('excel_path1').value = '../../Excel_Report/Blank.xls';
		e.preventDefault();
		var form_obj = $('#dwnreport');
		form_obj.submit();
	}
	else
	{
		js_progress_start();
		var vservice_path = vcgi_dir + 'restore_tableG/CgiReportWrapper_V2_mgmt.py?';
		var vret_str = 'inp_detail=' + vdb_name + ':$:' + vbatch_nameR +':$:excel:$:ext';
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
				if (self.xmlHttpReq.status == 200)
				{
					var vret = self.xmlHttpReq.responseText;
					var vret1 = Get_Str_trim(vret);
					var kdata_ar = eval(vret1);
					var kdownload_file_name = kdata_ar[0].table_str_report;
					document.getElementById('excel_path1').value = '../../Excel_Report/' + kdownload_file_name + '.xlsx';
					e.preventDefault();
					var form_obj = $('#dwnreport');
					form_obj.submit();
					js_progress_end();
				}
				else
				{
					alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
					js_progress_end();
				}
			}
		}
		self.xmlHttpReq.open('POST', strURL, true);
		self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		self.xmlHttpReq.send(vret_str);
	}
}
//*********************************************************************************************************************************************************
function show_report_for_batches()
{
	js_progress_start();
	var vservice_path = vcgi_dir + 'restore_tableG/CgiReportWrapper_V2_mgmt.py?';
	var vret_str = 'inp_detail=' + vdb_name + ':$:' + vbatch_nameR +':$:report:$:ext';
	var strURL = vservice_path;
	//alert(strURL + vret_str);
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
				var vret = self.xmlHttpReq.responseText;
				var vret1 = Get_Str_trim(vret);
				var kdata_ar = eval(vret1);
				var ktable_str = kdata_ar[0].table_str_report;
				document.getElementById('div_report_table').innerHTML = ktable_str;
				js_progress_end();
			}
			else
			{
				alert("There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
				js_progress_end();
			}
		}
	}
	self.xmlHttpReq.open('POST', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	self.xmlHttpReq.send(vret_str);
}
//*********************************************************************************************************************************************************
function clear_all_check_batches()
{
	var x = document.getElementsByName('chk_batch_name');
	for (var count=0;count<x.length;count++)
	{
		if(x[count].checked == true)
			x[count].checked = false;
	}
}
//*********************************************************************************************************************************************************
function get_batch_name(cnt, e)
{
	e.stopPropagation();
	vbatch_nameR = '';
	var y = document.getElementsByName('chk_batch_report');
	for(var i=0;i<y.length;i++)
	{
		if (y[i].checked == true)
		{
			if (document.getElementById('ul_header_' + cnt.toString()).style.display == 'none')
			{
				document.getElementById('ul_header_' + cnt.toString()).style.display = 'block';
			}
			var x = document.getElementsByName('chk_url_batch_' + y[i].value);
			for(var count=0;count<x.length;count++)
			{
				x[count].checked = true;
				vbatch_nameR += x[count].value + '~';
			}
		}
		else
		{
			var x = document.getElementsByName('chk_url_batch_' + y[i].value);
			for(var count=0;count<x.length;count++)
			{
				x[count].checked = false;
			}
		}
	}
	vbatch_nameR = vbatch_nameR.substr(0, vbatch_nameR.length-1);
}
//*********************************************************************************************************************************************************
function get_selected_urls()
{
	vbatch_nameR = '';
	var y = document.getElementsByName('chk_batch_report');
	for(var i=0;i<y.length;i++)
	{
		var x = document.getElementsByName('chk_url_batch_' + y[i].value);
		for(var count=0;count<x.length;count++)
		{
			if (x[count].checked == true)
			{
				vbatch_nameR += x[count].value + '~';
			}
		}
	}
	vbatch_nameR = vbatch_nameR.substr(0, vbatch_nameR.length-1);
}
//*********************************************************************************************************************************************************
function show_all_urls(cnt)
{
	if (document.getElementById('ul_header_' + cnt.toString()).style.display == 'none')
	{
		document.getElementById('ul_header_' + cnt.toString()).style.display = 'block';
	}
	else
	{
		document.getElementById('ul_header_' + cnt.toString()).style.display = 'none';
	}
}
//*********************************************************************************************************************************************************
