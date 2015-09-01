//*********************************************************************************************************************************************************
var gpg_u = '';
//*********************************************************************************************************************************************************
function GetHTMLPage_Details()
{
	$('#lblws_name').html(sessionStorage['caseName']+ " " + ">" + " " + sessionStorage['colW'] );
	update_user_time();
}
//*********************************************************************************************************************************************************
function restore_tableA_by_colA(kuser_id)
{
	var vservice_path = vcgi_dir + 'restore_tableA/cgi_restore_tableA.py?inp_detail=';
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
			if ( self.xmlHttpReq.status == 200 )
			{
				var vret = self.xmlHttpReq.responseText;
				vuser_name = Get_Str_trim(vret);
				document.getElementById('lbluser_name').innerHTML = vuser_name + '   |   ';
				restore_tableC();
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
function restore_tableB_by_colB()
{
	var vservice_path = vcgi_dir + 'restore_tableB/cgi_restore_tableB_by_colB.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + sessionStorage['colV'] + ':$:' + sessionStorage['project_id'];
	var strURL = vservice_path + vret_str;
        //alert(strURL);
	//alert(sessionStorage['batch_name'].split('_'));
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
				gpg_u = kdata_ar[0].colB;
				document.getElementById('lblws_name').innerHTML = gpg_u + '  (' + sessionStorage['colV']+ ')';
				restore_tableC();
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
	self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
function update_user_time()
{
	var vservice_path = vcgi_dir + 'restore_tableA/cgi_logout_user1.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + getQuerystring('user_id') + ':$: :$:' + sessionStorage['unique_key'] + ':$:2:$:' + sessionStorage['colX'];
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
				var vret = Get_Str_trim(self.xmlHttpReq.responseText);
				if(vret == 'DONE')
				{
					restore_tableA_by_colA(getQuerystring('user_id'));
				}
				else if(vret == 'User Already Logged In Another Machine')
				{
					alert(vret);
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
function Add_missed_mgmt_page()
{
	var kurl = fixedEncodeURIComponent(document.getElementById('txturl').value);
	var vservice_path = vcgi_dir + 'restore_tableF/save_tableF_by_colF.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + kurl + ':$:' + getQuerystring('user_id');
	var strURL = vservice_path + vret_str;
	alert(strURL);
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
				var vret = Get_Str_trim(self.xmlHttpReq.responseText);
				if (vret == 'DONE')
				{
					document.getElementById('txturl').value = '';
					restore_tableF();
				}
			}
			else
			{
				alert("1 ----------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
function Add_missed_attribute()
{
	var kattr = fixedEncodeURIComponent(document.getElementById('txtattribute').value);
	var kattr_cnt = document.getElementById('txtcnt').value;
	var vservice_path = vcgi_dir + 'restore_tableF/save_tableH_by_colE.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + vcolC_f + ':$:' + kattr + ':$:' + kattr_cnt + ':$:' + getQuerystring('user_id');
	var strURL = vservice_path + vret_str;
	alert(strURL);
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
				var vret = Get_Str_trim(self.xmlHttpReq.responseText);
				if (vret == 'DONE')
				{
					document.getElementById('txtattribute').value = '';
					document.getElementById('txtcnt').value = '';
					restore_tableG();
				}
			}
			else
			{
				alert("1 ----------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
function change_review_status(p_id, re_c, p_di, elem, flg)
{
	var kimg_ar = (elem.src).split('/');
	var kimg_path = kimg_ar[kimg_ar.length-1];
	var kf = 'N';
	if (kimg_path == 'purple_check.png')
	{
		kf = 'N';
		elem.src = "icons/purple_delete.png"
	}
	else if(kimg_path == 'purple_delete.png')
	{
		kf = 'Y';
		elem.src = "icons/purple_check.png"
	}
	var vservice_path = vcgi_dir + 'restore_tableC/update_tableD_by_colR.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + p_id + ':$:' + re_c + ':$:' + p_di + ':$:' + kf + ':$:' + flg;
	var strURL = vservice_path + vret_str;
	alert(strURL)
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
			}
			else
			{
				alert("1 ----------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
function save_user_feedback()
{
	var kex_flg = get_feedback_flag('3');
	var kms_flg = get_feedback_flag('4');
	var krw_flg = get_feedback_flag('5');
	var row_len = document.getElementById("dg_tableG").rows.length - 1;
	var ktax_cnt_str = '';
	for(var i=0;i<row_len;i++)
	{
		var krow = (i+1).toString();
		var ktx_id = document.getElementById(krow + '_MPI2').innerHTML;
		var ktx_cnt = document.getElementById(krow + '_MPI3').innerHTML;
		ktax_cnt_str += ktx_id + '~' + ktx_cnt + '!!'
	}
	ktax_cnt_str = ktax_cnt_str.substr(0, ktax_cnt_str.length-2);
	var kcomment = fixedEncodeURIComponent(document.getElementById('feedBack_txt').value);
	//alert(kex_flg + '--' + kms_flg + '--' + krw_flg + '--' + ktax_cnt_str + '--' + kcomment);
	var vservice_path = vcgi_dir + 'restore_tableF/insert_into_tableI.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + vcolC_f + ':$:' + kex_flg + ':$:' + kms_flg + ':$:' + krw_flg + ':$:' + ktax_cnt_str + ':$:' + getQuerystring('user_id') + ':$:' + kcomment;
	var strURL = vservice_path + vret_str;
	alert(strURL);
	return;
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
				var vret = Get_Str_trim(self.xmlHttpReq.responseText);
				if (vret == 'DONE')
				{
					restore_tableF();
				}
			}
			else
			{
				alert("1 ----------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
			}
		}
	}
	self.xmlHttpReq.open('GET', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	params = '';
	self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
