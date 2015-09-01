var first_dot = '.';
var second_dot = '..';
var third_dot = '...';
var vprogress_str="Processing data, Please wait"
//*************************************************PROGRESS BAR***************************************************************************
function js_progress_start()
{
	$("#progress").removeClass('progres_div_none').addClass('progres_div');
	document.getElementById('progress').style.fontWeight = 'bold';
	document.getElementById('label_div').innerHTML = vprogress_str; 
	setTimeout(delay1,500);
}
//*********************************************************************************************************************
function delay()
{
	document.getElementById('label_div').innerHTML = vprogress_str; 
	setTimeout(delay1,500);
}
//*********************************************************************************************************************
function delay1()
{
	document.getElementById('label_div').innerHTML = vprogress_str + first_dot;
	setTimeout(delay2,500);
}
//*********************************************************************************************************************
function delay2()
{
	document.getElementById('label_div').innerHTML = vprogress_str + second_dot;
	setTimeout(delay3,500);
}
//*********************************************************************************************************************
function delay3()
{
	document.getElementById('label_div').innerHTML = vprogress_str + third_dot;
	setTimeout(delay,500);
}
//*********************************************************************************************************************
function js_progress_end()
{
	$("#progress").removeClass('progres_div').addClass('progres_div_none');
}
//*********************************************************************************************************************
