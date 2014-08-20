var div_bursaryValue;
var req;
var div_bursaryData ;
var div_priority ;
var courseid;
var bursary_txt ; 

function bursaryLookup(id){
    // check for really old browsers
	if (!document.getElementById) {
		return true;
	}

	div_bursaryValue = document.getElementById('bursaryValue');	
	div_attractsBursary = document.getElementById('attractsBursary');	
	div_bursary = document.getElementById('bursary');	
	div_feeWaived = document.getElementById('feeWaived');	
	
	if (div_attractsBursary == null || div_attractsBursary.innerHTML == '' || div_attractsBursary.innerHTML == 'Y') {
		// attract bursary
		// if bursary is already calculated then display it
		bursary_txt = "";
		if (div_bursary != null && div_bursary.innerHTML != '') {
			var bursaryFormatted = addCommas(div_bursary.innerHTML);
			bursary_txt = bursary_txt +  "Your predicted bursary for this course is <strong>&pound;" + bursaryFormatted + "</strong>." ;
		} 
		if (div_feeWaived != null && div_feeWaived.innerHTML == 'Y') {
			bursary_txt = bursary_txt + " You also won't have to pay fees for your first year. " ;
		}
		if (bursary_txt != "") {
			div_bursaryValue.innerHTML = '<div id="bursaryHighlight"><strong>Financial help: </strong>' + bursary_txt + ' <a href="calcBursary.do?id=' + id + '">Change details</a> <a href="http://www.sheffield.ac.uk/bursaries">More bursary information</a></div>';	   	
		}
	}
	return true;
}

function addCommas(bursary){
	var retValue = bursary;
	if (bursary != '' && bursary.length >3 ) {
		retValue = bursary.substring(0,bursary.length-3) + ',' + bursary.substring(bursary.length-3,bursary.length );
	}
	return retValue;
}