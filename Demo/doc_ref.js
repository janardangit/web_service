var prevHighlightedObjs = [];
//*********************************************************************************************************************************************************
function load(refObj)
{
	$("#" + refObj.frameId).attr("src", refObj.purl);
}
//*********************************************************************************************************************************************************
function gotoref(refObj)
{
	if ($('#frame-name').attr('src') != refObj.purl)
	{
		$("#" + refObj.frameId).attr("src", refObj.purl);
	}
	$("#" + refObj.frameId).load(function ()
	{
		showalert(refObj.frameId, refObj.refIds);
	});
}
//*********************************************************************************************************************************************************
function showalert(myframe,rids)
{
	var oiframe = document.getElementById(myframe);
	var fDocument = null;
	var fWindow = null;

	if(oiframe.contentDocument)
	{
		// Firefox, Opera
		fDocument = oiframe.contentDocument;
		fWindow = oiframe.contentWindow;
	}
	else if(oiframe.contentWindow)
	{
		// Internet Explorer
		fDocument = oiframe.contentWindow.document;
		fWindow = oiframe.contentWindow;
	}
	else if(oiframe.document)
	{
		// Others
		fDocument = oiframe.document;	 
		fWindow = oiframe.window;
	}
	if(fDocument == null)
		alert( "Document not initialized");
	//alert (fDocument+"--"+fWindow)

   if( prevHighlightedObjs.length>0)
   {
       for( var i=0; i<prevHighlightedObjs.length; i++){
           var pObj = prevHighlightedObjs[i];
           if(pObj)
           try {
                pObj.style.backgroundColor = '';    
           }catch(err){}
        }
        prevHighlightedObjs = [];   
   }
   
   if(rids.indexOf("#")>=0){
        var ridsArr = rids.split("#");
        var firstObj = false;
        for( var i=0; i<ridsArr.length; i++){
           var obj = fDocument.getElementById(ridsArr[i]);
           prevHighlightedObjs.push(obj);
           var left = 0;
           var top = 0;
           if((firstObj==false)&& (obj)){
		        obj.style.backgroundColor = '#FFFF00';
		        if (obj.offsetParent){ 			
			        do {
				        left += obj.offsetLeft; 
				        top += obj.offsetTop;
			        } while (obj = obj.offsetParent);
		        } 		
		        fWindow.scrollTo(left-20,top-20);
		        
		        firstObj = true;
	        }else if(obj){
	            obj.style.backgroundColor = '#FFFF00';
	            
	        }
        }
   }else if(rids!=""){
       var htmlelement = fDocument.getElementById(rids);
       prevHighlightedObjs.push(htmlelement);
       var left = 0;
       var top = 0;
       if(htmlelement){
		    htmlelement.style.backgroundColor = '#FFFF00';
		    if (htmlelement.offsetParent){ 			
			    do {
				    left += htmlelement.offsetLeft; 
				    top += htmlelement.offsetTop;
			    } while (htmlelement = htmlelement.offsetParent);
		    }
		    fWindow.scrollTo(left-20,top-20);
	    }    
   }
}
//************************************************************************************************************************************
