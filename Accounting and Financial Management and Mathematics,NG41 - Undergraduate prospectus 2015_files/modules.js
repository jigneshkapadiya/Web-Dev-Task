var divhandler = new getBlockId(null);
var div_modDescrip;

function makeRequest(url, blockId) 
{

	// check they don't have a really rubbish old browser
	if (document.getElementById) {
		// make the request via HTTP
		if(window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		}
		// make the request via activex
		else if(window.ActiveXObject) {
			request = new ActiveXObject("MSXML2.XMLHTTP");
		}
		// this browser won't support anything. maybe activex is disabled?
		// either way return true and fall back to hyperlinks
		else {
			return true;
		}
		// request the URL we need
		sendRequest(url + "&output=xml", blockId);
		return false;
	} else {
		return true;
	}
}

function sendRequest(url, blockId) {
	request.onreadystatechange = onResponse;
	request.open("GET", url, true);
	divhandler.blockId = blockId; 
	request.send(null);
}

function checkReadyState(obj) {

	if(obj.readyState == 0) { window.status = "Sending Request..."; }
	if(obj.readyState == 1) { window.status = "Loading Response..."; }
	if(obj.readyState == 2) { window.status = "Response Loaded..."; }
	if(obj.readyState == 3) { window.status = "Response Ready..."; }
	if(obj.readyState == 4)	{
	window.status = "";
		if(obj.status == 200) {
			return true;
		} else {
			//  a weird status code has come up. show an error message and bail
			document.getElementById(divhandler.blockId).innerHTML = "There was a problem retrieving the module.";
		}
	}
}

function onResponse() {
 
 	// when the server has responded with some useful content
	if(checkReadyState(request)) {
		// get the document
		var response = request.responseXML.documentElement;
		// parse the xml for the content we want
		var description = response.getElementsByTagName('description')[0].firstChild.data;
		// populate the correct block
		document.getElementById(divhandler.blockId).innerHTML = description;													 
	} 
}

function module(blockId, url) {

	// toggle the current block on or off
	if (document.getElementById) {
		vista = (document.getElementById(blockId).style.display == 'none') ? 'block' : 'none';
		document.getElementById(blockId).style.display = vista;
		
		// check and see if the block has contents in it alredy.
		// if the block is empty then query the database
		if (document.getElementById(blockId).innerHTML.replace(/^\s*|\s*$/g,"") == '') {
			return makeRequest(url, blockId);
						
		} else {
			// the block is already full, so we can just display the content
			// and not make a request to the server
			// we can return false because the browser MUST have supported the makeRequest method
			// in order to populate the block in the first place!
			return false;
		}
		
	}		
}

function getBlockId(blockId) {
   var blockId;
   return blockId;
}

function module(unitCode, calCode, startDate) {
    
	// check for really old browsers
	if (!document.getElementById) {
		return true;
	}

	div_modDescrip   = document.getElementById(unitCode);	
   	
   	// switch the block type
   	descType = (div_modDescrip.style.display == 'none') ? 'block' : 'none';
	div_modDescrip.style.display = descType;
       
	// get a http connection
	if (window.XMLHttpRequest) {
       req = new XMLHttpRequest();
   	} else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   	} else {
   		// their browser doesn't support this
   		// or they've disabled ActiveX in IE.
   		return true;
   	}
   	
   	if (div_modDescrip.innerHTML.replace(/^\s*|\s*$/g,"") == '') {
   		//description is not available so make a request to the server
   
   		var url = "/prospectus/descriptionXml.do?unitCode=" + unitCode + "&effStartDate=" + startDate + "&cTypeCode=" + calCode;	
   		req.open("GET", url, true);
   	
   		// deal with the output
   		req.onreadystatechange = showModDescrip;
   		req.send(null);  	
  		return false;
  		
   	} else {
   		//description is available, so DON'T make a request to the server
   		return false;
   	}
}

function showModDescrip() {
	if (req.readyState == 4) {
      if (req.status == 200) {
		var desc = req.responseXML.getElementsByTagName("Description");	
    	div_modDescrip.innerHTML = desc[0].childNodes[0].nodeValue;
      }
    }
}