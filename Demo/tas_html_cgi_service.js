var gbl_cur_section_label = null;
//*********************************************************************************************************************************************************

function restore_tableC()
{
	js_progress_start();
        var vservice_path = vcgi_dir + 'restore_tableC/cgi_restore_tableD_new.py?inp_detail=';
        var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + sessionStorage['project_id'];
        var strURL = vservice_path + vret_str;
    	console.log(strURL);
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
                                var kdata_ar = eval(vret);
                                vcolP = kdata_ar[0].colP;
                vcolG = kdata_ar[0].main_data;
		count = 0
		for(var key in vcolG){
			count += 1
			create_dynamic_divs(count);
			//document.getElementById("cs_lblws_name_tableD"+count.toString()).innerHTML = key;
			document.getElementById("div_dg_tableD" + count.toString()).innerHTML = vcolG[key];	
		}
		var first_tr	= document.getElementById('div_dg_tableD1').childNodes[0].rows[1];
		var meta_data = first_tr.getAttribute('meta_data');
		getColor_tableD(meta_data, first_tr);
		js_progress_end();	
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
function create_dynamic_divs(count)
{
	var name_div = document.createElement("div");
	name_div.setAttribute("class","cs_oper_div");
	name_div.setAttribute("id","cs_oper_div" + count.toString());
	document.getElementById("div_tab_PE").appendChild(name_div);
	

	var name_label = document.createElement("label");
        name_label.setAttribute("id", "cs_lblws_name_tableD" + count.toString());
        name_label.setAttribute("class", "cs_lblws_name");
	document.getElementById("cs_oper_div" + count.toString()).appendChild(name_label);
	
	var tab_div = document.createElement("div");
	tab_div.setAttribute("id","div_dg_tableD"+count.toString());
	tab_div.setAttribute("class","cs_left_upper_half_P");
	document.getElementById("div_tab_PE").appendChild(tab_div);	
}


//*********************************************************************************************************************************************************
function restore_tableC_old()
{
	var vservice_path = vcgi_dir + 'restore_tableC/cgi_restore_tableC.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + sessionStorage['colV'];
	var strURL = vservice_path + vret_str;
    console.log(strURL);
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
				var kdata_ar = eval(vret);
				vcolP = kdata_ar[0].colP;
                vcolG = kdata_ar[0].main_data;
                var div = document.getElementById('section_index_div');
                var str = '<label style="color:#fff;">'+'Study Order'+':&nbsp;&nbsp;'+'</label>'
                var count = 1;
                for(var x = 0; x<vcolG.length; x++){
                        str +=  '<label style="color:#fff;cursor:pointer;" id=section_label_'+ vcolG[x] +' onclick="go_to_section_results(this)" section_val='+vcolG[x]+'>'+ count +'</label>&nbsp;&nbsp;&nbsp;&nbsp;'
                        count    = count+1;
                }
                div.innerHTML = str;
                document.getElementById('section_label_'+vcolG[0]).click();
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
go_to_section_results   =   function(ele){
        if(gbl_cur_section_label){
                gbl_cur_section_label.style.color = '#fff'
        } 
        gbl_cur_section_label = ele;
        ele.style.color = '#F75700';
        var section_val = ele.getAttribute('section_val');
        clear_grid_data('div_dg_tableD');
	        var vservice_path = vcgi_dir + 'restore_tableC/cgi_restore_tableD.py?inp_detail=';
	        var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + section_val;
	        var strURL = vservice_path + vret_str;
            console.log(strURL);
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
                        var kdata_ar = eval(vret);
                        var ktable_ar = kdata_ar[0].main_data;
                        document.getElementById('div_dg_tableD').innerHTML = ktable_ar[0];
                        document.getElementById('div_dg_tableE').innerHTML = ktable_ar[1];
                        document.getElementById('div_dg_tableF').innerHTML = ktable_ar[2];
                        getColor_tableD(kdata_ar[0].colI, document.getElementById('dg_tableD').rows[1])
                            //getColor_tableD(kdata_ar[0].colI);
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
function restore_tableD(kd_id)
{
	clear_grid_data('div_dg_tableD');
	var vservice_path = vcgi_dir + 'restore_tableC/cgi_restore_tableD.py?inp_detail=';
	var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + kd_id;
	var strURL = vservice_path + vret_str;
    console.log(strURL);
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
				var kdata_ar = eval(vret);
                var ktable_ar = kdata_ar[0].main_data;
				document.getElementById('div_dg_tableD').innerHTML = ktable_ar[0];
				document.getElementById('div_dg_tableE').innerHTML = ktable_ar[1];
				document.getElementById('div_dg_tableF').innerHTML = ktable_ar[2];
                getColor_tableD(kdata_ar[0].colI, document.getElementById('dg_tableD').rows[1])
				//getColor_tableD(kdata_ar[0].colI);
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
function call_cgi_generate_report(e)
{
    js_progress_start();
    var vservice_path = vcgi_dir + 'web_inf/cgi_generate_excel_output.py?input_str=';
    //var vret_str = vdb_name + ':$:' + sessionStorage['colX'];
    var json    = {'agent_id':sessionStorage['colX'] ,'mgmt_id': sessionStorage['colZ'], 'user_id':sessionStorage['colY'], 'parent_doc_id':sessionStorage['colV']}
    var strURL = vservice_path + JSON.stringify(json);
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
                var res = eval(vret);
                var kdownload_file_name = res;
                var file_path   = window.location.origin+'/TAS_Clinical_Trials/' + kdownload_file_name;
                js_progress_end();
                window.open(file_path);
                /*document.getElementById('excel_path1').value = '../../TAS_Clinical_Trials/' + kdownload_file_name;
                e.preventDefault();
                form_obj = $('#dwnreport');
                form_obj.submit();*/
            }
            else
            {
                alert("1 ----------- There was a problem retrieving the data:\n" + self.xmlHttpReq.statusText);
                js_progress_end();
            }
        }
    }
    self.xmlHttpReq.open('GET', strURL, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    params = '';
    self.xmlHttpReq.send(params);
}
//*********************************************************************************************************************************************************
