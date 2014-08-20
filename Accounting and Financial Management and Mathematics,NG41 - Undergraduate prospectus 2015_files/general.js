function toggle( targetId, targetTab ){

  if (document.getElementById){

	// hide the course summary content
	var courseSummary = document.getElementById('courseSummary');
	var courseSummaryLink = document.getElementById('courseSummaryLink');
		courseSummary.style.display = 'none';
        courseSummaryLink.className = 'inactive';
		
	// hide the department content
	var department = document.getElementById('department');
	var departmentLink = document.getElementById('departmentLink');
       department.style.display = 'none';
	   departmentLink.className = 'inactive';
		    	
	// hide the modules content	
	var modules = document.getElementById("modules");
	var modulesLink = document.getElementById("modulesLink");
        modules.style.display = "none";
		modulesLink.className = "inactive";
	
	// hide the student profile content	
	var studentprofile = document.getElementById("studentprofile");
	var studentprofileLink = document.getElementById("studentprofileLink");
        studentprofile.style.display = "none";
		studentprofileLink.className = "inactive";

	// hide the graduates content
	var graduates = document.getElementById("graduates");
	var graduatesLink = document.getElementById("graduatesLink");
        graduates.style.display = "none";
		graduatesLink.className = "inactive";
		
	// hide the user defined tab content
	var userDefinedTab = document.getElementById("userDefinedTab");
	var userDefinedTabLink = document.getElementById("userDefinedTabLink");
	if(userDefinedTab != null){
        userDefinedTab.style.display = "none";
    }
    if(userDefinedTabLink != null){
        userDefinedTabLink.className = "inactive";
    }
		
	// hide the what next content.
	var whatnext = document.getElementById("whatnext");
	var whatnextLink = document.getElementById("whatnextLink");
        whatnext.style.display = "none";
		whatnextLink.className = "inactive";			
			
  // show the desired content block
        target = document.getElementById( targetId );
          target.style.display = "block";
  	  // set the selected active tab 
	   tab = document.getElementById(targetTab);
	      tab.className = "active";


	// get back to the top
	window.scrollTo(0,0);
	
  } 
  
}
function showEntryRequirements() {
		var entryRequirements = document.getElementById('entryRequirements');
		entryRequirements.style.display = 'block';		
		return false;
}
function closeEntryRequirements() {
		var entryRequirements = document.getElementById('entryRequirements');
		entryRequirements.style.display = 'none';		
		return false;
}

function showHelp(helpBoxId) {
	var helpBoxRef = document.getElementById(helpBoxId);
	helpBoxRef.style.display = 'block';					
	return false;
}
		
function hideHelp(helpBoxId) {
	var helpBoxRef = document.getElementById(helpBoxId);
	helpBoxRef.style.display = 'none';		
	return false;
}
		
function checkAdditionalBursaryTxtVisible(checkbox){
var divToCheck = document.getElementById('addBursaryTxt');
 if(checkbox.checked){
	 divToCheck.style.display='block';
 }
 else{
	divToCheck.style.display='none';
 }
}
function checkUserDefinedTabFieldsVisible(toggle){
var tabDivToCheck = document.getElementById('tabDiv');	   
 if(toggle == "on"){
	 //alert("checkbox checked!");
	 tabDivToCheck.style.display='block';
 }else{
	 //alert("checkbox not checked!");
	 tabDivToCheck.style.display='none';
 }
}

function checkVideoFieldsVisible(toggle){
	var vidDivToCheck = document.getElementById('vidDiv');	   
	 if(toggle == "on"){
		 //alert("checkbox checked!");
		 vidDivToCheck.style.display='block';
	 }else{
		 //alert("checkbox not checked!");
		 vidDivToCheck.style.display='none';
	 }
}

