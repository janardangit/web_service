//*********************************************************************************************************************************************************
function Go_To_DocumentPage()
{
	sessionStorage['batch_name'] = '';
	window.location.replace('document_details.html?user_id='+sessionStorage['vuser_id']);
}
//*********************************************************************************************************************************************************
function restore_tableA_by_colA()
{

	var vuser_id = document.getElementById("txtuser_id").value;
	var vuser_passwd = document.getElementById("txtuser_passwd").value;
	sessionStorage['vuser_id'] = vuser_id;
	sessionStorage['vuser_passwd'] = vuser_passwd;
	if (vuser_id!='')
	{
		if (vuser_passwd!='')
		{
			var vservice_path = vcgi_dir +'change_detection/cgi_user_login.py?inp_detail=';
			var vret_str = vdb_name + ':$:' + vuser_id + ':$:' + vuser_passwd + ':$:0:$:1:$: ';
			var strURL = vservice_path + vret_str;
            		//alert(strURL);
            		console.log(strURL);
			/*$.ajax({url:strURL, success:function(vret)
			{
					var vret1 = Get_Str_trim(vret);
					if(vret1 == 'Incorrect Login Details')
					{
						alert('Incorrect Login Details');
					}
					else if (vret1 == 'User Already Logged In')
					{
						alert('User Already Logged');
					}
					else
					{
						sessionStorage['unique_key'] = vret1;
						Go_To_DocumentPage();
					}
				}
			});*/
			if((vuser_id == 'madan' && vuser_passwd == 'tas123') || (vuser_id == 'tapas' && vuser_passwd == 'tas123') || (vuser_id == 'pravat' && vuser_passwd == 'tas123') || (vuser_id == 'user1' && vuser_passwd == 'tas#123')){
				Go_To_DocumentPage();
			}else{
				alert('Incorrect Login Details');
			}
		}
		else
		{
			alert('Please Enter User password');
		}
	}
	else
	{
		alert('Please Enter User Name');
	}
}
