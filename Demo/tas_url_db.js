//*********************************************************************************************************************************************************
function Go_To_UrlPage(casename_project_id)
{
	array = casename_project_id.split(":$:");
	sessionStorage['caseName'] = array[0];
	sessionStorage['project_id'] = array[1];
        sessionStorage['batch_name'] = '';
        window.location.replace('document.html?user_id='+sessionStorage['vuser_id']);
}
//*********************************************************************************************************************************************************
