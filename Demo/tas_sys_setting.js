//*********************************************************************************************************************************************************
var vuser_id = '';
var vdb_name = '1'; // for Mysql
var vdisplay_status = '1';
var vcgi_dir = '../../../../cgi-bin/cgi_Lexis_Link_Monitoring/slt_Code/';
var vdata_dir = '../../../Notofications/';
var vhtml_dir = '../../data/output/html/';
var vexcel_output = '../../Excel_Output/';
var vuser_name = '';
//*********************************************************************************************************************************************************
function Set_Focus_txtuser_id()
{
	document.getElementById('txtuser_id').focus();
}
//*********************************************************************************************************************************************************
$(document).ready(function()
{
	if ($.browser.mozilla)
	{
    		$(document).keypress (ShortcutKeys);
	}
	else
	{
    		$(document).keydown (ShortcutKeys);
	}
});
//*********************************************************************************************************************************************************
function ShortcutKeys(event)
 {
	// Enter
	if (event.keyCode == 13)
	{
		restore_tableA_by_col();
	}
}
//*********************************************************************************************************************************************************
function getQuerystring(key, default_)
{
      if (default_==null) default_="";
        key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
          var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
            var qs = regex.exec(window.location.href);
              if(qs == null)
                      return default_;
                        else
                                return qs[1];
}
//*********************************************************************************************************************************************************
function fixedEncodeURIComponent(str)
{
      return encodeURIComponent(str).replace(/[!'():*']/g, escape);
}
//*********************************************************************************************************************************************************
function Go_To_Login()
{
	//update_tableA_colD();
	sessionStorage.vuser_id == '';
        window.location.href = 'login.html';
}
//*********************************************************************************************************************************************************
function Get_Str_trim(stringToTrim)
{
        var vret='';
        if (stringToTrim==null) vret='';
        if(stringToTrim !='undefined')
        {
                vret = stringToTrim.replace(/^\s+|\s+$/g,"");
        }
        return vret;
}
//*********************************************************************************************************************************************************
function clear_grid_data(ktable_name)
{
	var cell = document.getElementById(ktable_name);
	if (cell.hasChildNodes())
	{
		while (cell.childNodes.length >= 1)
		{
			cell.removeChild(cell.firstChild);
		}
	}
}
//*********************************************************************************************************************************************************
