var options = window.options || {};
var sharedFunctions = window.sharedFunctions || {};
(function (namespace) {
  //  Gets the values in the dropdowns and sets them to local storage.
  //  Also recalls shared.startNotifications so that the notifications will be updated instantly.
  namespace.saveSelection = function() {
    var primary = $('#category').val();
    var secondary = $('#'+primary).val();
    var filter = $('#FilterTerm').val();
    if(filter !== '') {
      chrome.storage.local.set({ 'filterTerm': filter });
    }
    chrome.storage.local.set({ 'selectedCategory': primary + ','+secondary });
    sharedFunctions.startNotifications();
  };

  //  Loops through the LookupCategories in ksl_categories and adds them to the dropdown
  //  when a different one is selected.
  namespace.insertSubCategories = function(select){
    var output = "";
    for(var prop in LookupCategories[select])
    {
      output += '<option value="' + prop + '">' + prop + '</option>';
    }
    $('#'+select).html(output);
  };

  //  Shows the dropdown by the id of the category dropdown and hides the rest.
  //  Adds the listener to the save click event.
  $(document).ready(function(){
    $('#category').change(
      function(){
        $('.secondary').hide();
        var selectedItem = '#' + $(this).val();
      $(selectedItem).show();
      //  Inserts the categories into the dropdown
      namespace.insertSubCategories($(this).val());
      });
    $('#Save').click(namespace.saveSelection);
  });
})(options);