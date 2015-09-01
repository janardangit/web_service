//*********************************************************************************************************************************************************
var vcolC = '';
var vcolD = '';
var kpg_w = '';
var kpg_h = '';
var korg_mgmt_url = '';
var vrw = 1;
var vcolC_f = '';
var vcolG = [];
var vcolP = 0;
var global_tracker_tr = null;
//*********************************************************************************************************************************************************
function Back_To_DocumentPage()
{
	window.location.replace('document.html?user_id='+getQuerystring('user_id'));
}

//*********************************************************************************************************************************************************
function Back_To_Document_DetailPage()
{
        window.location.replace('document_details.html?user_id='+getQuerystring('user_id'));
}


//*********************************************************************************************************************************************************
go_to_next_section  = function(){
    var cur_section_ind  = vcolG.indexOf(vcolP)
    if(vcolG.length > cur_section_ind+1){
            var kd_id   = vcolG[cur_section_ind+1];
            clear_grid_data('div_dg_tableD');
	        var vservice_path = vcgi_dir + 'restore_tableC/cgi_restore_tableD.py?inp_detail=';
	        var vret_str = vdb_name + ':$:' + sessionStorage['colX'] + ':$:' + sessionStorage['colY'] + ':$:' + sessionStorage['colZ'] + ':$:' + kd_id;
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
                    if (self.xmlHttpReq.status == 200)
                    {
                        var vret = Get_Str_trim(self.xmlHttpReq.responseText);
                        var kdata_ar = eval(vret);
                        var ktable_ar = kdata_ar[0].main_data;
                        document.getElementById('div_dg_tableD').innerHTML = ktable_ar[0];
                        document.getElementById('div_dg_tableE').innerHTML = ktable_ar[1];
                        document.getElementById('div_dg_tableF').innerHTML = ktable_ar[2];
                        getColor_tableD(kdata_ar[0].colI, document.getElementById('dg_tableD').rows[1])
                        vcolP   = kd_id;
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
    else{
            alert('NO more Section') 
    }
}

//*********************************************************************************************************************************************************
function getColor_tableD(krow_t, ele)
{
    if(global_tracker_tr){
        var cell_len = global_tracker_tr.cells.length;
        for(var x = 0; x<cell_len; x++){
            global_tracker_tr.cells[x].className = 'td_data_new';
        }
    }
    global_tracker_tr = ele;
    var cell_len    = ele.cells.length;
    for(var x = 0; x<cell_len; x++){
        ele.cells[x].className = 'tr_visited_bg_new';
    }
	/*var krow = krow_t.split('!!')[0];
	var row_len = document.getElementById("dg_tableD").rows.length - 1;
	var numCols = $("#dg_tableD").find('tr')[0].cells.length;
	for(var i=0;i<row_len;i++)
	{
		var rows = (i+1).toString();
		var vcss_typ='';
		if(i+1==krow)
		{
			vcss_typ = "tr_visited_bg_new";
		}
		else
		{
			vcss_typ ="td_data_new";
		}
		for(var j=0;j<numCols;j++)
		{
			document.getElementById(rows+'_PP'+(j+1).toString()).className = vcss_typ;
		}
	}*/
	var kcol_di = krow_t.split('!!')[0];
	var kcol_pg = krow_t.split('!!')[1];
	var kcol_cd = krow_t.split('!!')[2];
	var kpg_w = krow_t.split('!!')[3];
	var kpg_h = krow_t.split('!!')[4];
        //alert(JSON.stringify(krow_t));

    	var f_name = sessionStorage['colX'] + '_' + sessionStorage['colY'] + '_' + sessionStorage['colZ'];
	//alert(f_name)
	//TAS_Assets/1_31_1/images/20150401/20150401-page-1.png
	var image_dir = '../../../INFOSIEVE_PROJECTS/Assets/data/output/'
	//var zimg1_path = vdata_dir + f_name + '/images/' + kcol_di + '/' + kcol_di +'-page-1.png';
	var zimg1_path = image_dir + kcol_di + '/image/' + kcol_di +'-page-'+ kcol_pg +'.png';
	
	//alert(zimg1_path);
	var kpd = document.getElementById('profile_1');
	load_image(zimg1_path, kpg_w, kpg_h, kpd, 'pri_prof_img_div');
    create_cord_divs(kcol_cd, 'pri_prof_img_div');
}
//*********************************************************************************************************************************************************
function load_image(img_path, w, h, kpd, kid)
{
	//alert(img_path+'--'+w+'--'+h+'--'+kpd+'--'+kid);
	kpd.innerHTML = '<div style="background-image:url('+img_path+');background-repeat:no-repeat;width:'+w+'px;height:'+h+'px;top:0px;left:0px;overflow:hidden;position:relative;" id="'+kid+'"></div>';
}
//*********************************************************************************************************************************************************
function load_image_nobio(img_path, w, h, kpd, kid)
{
	kpd.innerHTML = '<div style="background-image:url('+img_path+');background-repeat:no-repeat;width:'+w+'px;height:'+h+'px;top:20%;left:35%;overflow:hidden;position:relative;" id="'+kid+'"></div>';
}
//*********************************************************************************************************************************************************
function create_cord_divs(kcol_cd, kid)
{
	var all_bboxes	= kcol_cd.split('~');
	var kpd = document.getElementById(kid);
	for(var i = 0; i<all_bboxes.length; i++){
		var kcd_sp = all_bboxes[i].split('_');
		var x = kcd_sp[0];
		var y = kcd_sp[1];
		var w = kcd_sp[2];
		var h = kcd_sp[3];
    		y = y-2;
                x = x-2;
		var kdiv = document.createElement("div");
		kdiv.setAttribute("style", 'width:'+w+'px; height:'+h+'px;top:'+y+'px; left:'+x+'px; position:absolute;border:#ff0000 2px solid;z-index:22;');
		kpd.appendChild(kdiv);
		document.getElementById(kpd.parentNode.id).scrollTop = y-50;
		document.getElementById(kpd.parentNode.id).scrollLeft = x-50;
	}
}
//*********************************************************************************************************************************************************
