//*********************************************************************************************************************************************************
var TimerRunning = false;
var TimerID;
//*********************************************************************************************************************************************************
function StartTimer()
{
	TimerRunning = true;
	TimerID = self.setTimeout("StartTimer()",50000);
	restore_tableB_refresh();
}
//*********************************************************************************************************************************************************
function StopTimer()
{
	if(TimerRunning)
		clearTimeout(TimerID);
	TimerRunning=false;
}
//*********************************************************************************************************************************************************
function get_main_table_type(myElem)
{
	StopTimer();
	for(var i=1;i<3;i++)
	{
		document.getElementById('tab'+i.toString()).className = 'menuHead';
	}
	document.getElementById(myElem).className = 'menuHead active';
	if(myElem == 'tab1')
	{
		document.getElementById('div_process').style.display = 'block';
		document.getElementById('div_report').style.display = 'none';
		document.getElementById('div_batch_name').style.display = 'block';
		//document.getElementById('div_excel_option').style.display = 'block';

		document.getElementById('div_report_operation').style.display = 'none';

		ArrtableB.length = 0;
		StartTimer();
	}
	else if(myElem == 'tab2')
	{
		document.getElementById('div_process').style.display = 'none';
		document.getElementById('div_report').style.display = 'block';
		document.getElementById('div_batch_name').style.display = 'none';
		//document.getElementById('div_excel_option').style.display = 'none';

		document.getElementById('div_report_operation').style.display = 'block';

		document.getElementById('div_tableB_report').innerHTML = '';
		document.getElementById('div_report_table').innerHTML = '';

		call_cgi_restore_tableR();
	}
}
//*********************************************************************************************************************************************************
