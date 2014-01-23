var options = {};

//	Gets the values in the dropdowns and sets them to local storage.
//	Also recalls shared.startNotifications so that the notifications will be updated instantly.
options.saveSelection = function() {
	var primary = $('#category').val();
	var secondary = $('#'+primary).val();
	chrome.storage.local.set({'selectedCategory': primary + ','+secondary});
	shared.startNotifications();
};

//	Loops through the LookupCategories in ksl_categories and adds them to the dropdown
//	when a different one is selected.
options.insertSubCategories = function(select){
	var output = "";
	for(var prop in LookupCategories[select])
	{
		output += '<option value="' + prop + '">' + prop + '</option>';
	}
	$('#'+select).html(output);
};

//	Shows the dropdown by the id of the category dropdown and hides the rest.
//	Adds the listener to the save click event.
$(document).ready(function(){
	$('#category').change(
		function(){
			$('.secondary').hide();
			var selectedItem = '#' + $(this).val();
		$(selectedItem).show();
		//	Inserts the categories into the dropdown
		options.insertSubCategories($(this).val());
		});
	$('#save').click(options.saveSelection);
});