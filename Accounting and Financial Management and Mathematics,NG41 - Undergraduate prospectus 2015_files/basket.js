var div_basketCount;
var req;
var div_basketStatus;

function showBasketState(id){
	// check for really old browsers
	if (!document.getElementById) {
		return true;
	}

	div_basketCount = document.getElementById('basketCount');	
	div_basketStatus = document.getElementById('basketStatus');
	
	// url for the action
	var url = "processBasketXml.do?id=" + id ;
	
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
   	// make the request
   	req.open("GET", url, true);
   	// deal with the output
   	req.onreadystatechange = doBasket;
   	req.send(null);
   	// stop
   	return false;
}

function doBasket() {
	
	if (req.readyState == 4) {
      if (req.status == 200) {
		var items = req.responseXML.getElementsByTagName("Items");	
		var process = req.responseXML.getElementsByTagName("Process");	
		var processed = req.responseXML.getElementsByTagName("Processed");			
		
		if ((processed[0].childNodes[0].nodeValue)=='yes') {
		    if (items[0].childNodes[0].nodeValue == '0' ) {
			   div_basketCount.innerHTML = '<a href="buildProspectus.do">Build you own prospectus</a>';
    		} else {
    		   div_basketCount.innerHTML = '<a href="displayBasket.do">myProspectus</a> contains ' + items[0].childNodes[0].nodeValue + ' courses';
    		}
    		if ((process[0].childNodes[0].nodeValue)=='add') {	
    		  document.images['addtomyprospectus'].src = 'assets/images/myprospectus-add.png';	
    		  div_basketStatus.innerHTML = 'The course has been removed from myProspectus';	
    	    } else {
     		  document.images['addtomyprospectus'].src = 'assets/images/myprospectus-remove.png';
     		  div_basketStatus.innerHTML = 'The course has been added to myProspectus';		   	    
    	    }
    	   
    	} else {
 			div_basketCount.innerHTML = 'Error processing the basket! myProspectus contains ' + items[0].childNodes[0].nodeValue + ' courses.';   	
    	}
      }
    }
}