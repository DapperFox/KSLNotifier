var sharedFunctions = window.sharedFunctions || {};
(function (namespace) {
  //  Counter to change the ID
  var selectedCategory = "";
  //  Starts the notifications by getting the category, once the category has been pulled from storage it runs getInfo
  namespace.startNotifications = function(){
    chrome.storage.local.get('selectedCategory', getCategoryHandler);
  };

  //  The handler for the chrome.local.get callback.
  var getCategoryHandler = function(storage){
    selectedCategory = storage.selectedCategory;
    //  Gets the info from the site once the seleted category has been found
    getInfo();
  };

  namespace.clearFeed = function () {
    localStorage.storageArray = [];
    localStorage.lastDate = new Date().getTime();
  };


  var shouldAlertWithTitle = function (title, terms) {
    title = title.toLowerCase();
    var termsArray = terms.toLowerCase().split(" ");
    for (var i = 0; i < termsArray.length; i++) {
      var term = termsArray[i];
      if (term && title.indexOf(term) === -1) {
        return false;
      }
    }
    return true;
  };

  //  Runs an ajax request depending on the selected category.
  var getInfo = function(){
    //  Gets the category selected in the options pane and sets it to the url
    if(selectedCategory !== undefined) {
      var splitCategory = selectedCategory.split(",");
      var categoryUrl = LookupCategories[splitCategory[0]][splitCategory[1]];
      //  Ajax query to ksl to get information
      chrome.storage.local.get("filterTerm", function(data) {
        performRequestForFilter(categoryUrl, data.filterTerm || "");
      }); 
    } else {
      chrome.tabs.create({url: chrome.extension.getURL('options.html'), selected: true});
    }
  };

  var performRequestForFilter = function (categoryUrl, filterText) {
    console.log("performRequestForFilter", categoryUrl, filterText);
    filterText = (filterText || "").toLowerCase();
    $.ajax({url: 'http://www.ksl.com/resources/classifieds/rss_.xml'+categoryUrl, success: function(data){
      var $xml = $(data);
      var $guid = $xml.find('item guid');
        //  Checks if the most recent item is the same as the last notified item
        if (localStorage.guid !== $guid.eq(0).text()) {
          localStorage.guid = $guid.eq(0).text();
          var $title = $xml.find('item title');
          var $time = $xml.find('item pubDate');
          var $desc = $xml.find('item description');
          var $links = $xml.find('item link');
          var title = $title.eq(0).text() || "";
          var notify = false;
          if (!filterText || shouldAlertWithTitle(title, filterText)) {
            notify = true;
          }
          if (notify) {
            namespace.notify($title.eq(0).text(), $desc.eq(0).text(), $time.eq(0).text(), $links.eq(0).text());
          }
        }
      }
    });
  };

  //  Function to display the notification if something is new
  //  Currently not implementing the time
  namespace.notify = function(title, description, time, link) {
    var options = {
      type: "basic",
      title: title,
      message: description,
      iconUrl: "../kslicon.png"
    };
    var idKey = 'id' + localStorage.count;
    //  linkIdentifier is set here to create links on notifications
    var linkIdentifier = {
      identifier: [idKey, link]
    }

    if(localStorage.storageArray) {
      var arrayStore = JSON.parse(localStorage.storageArray);
      arrayStore.push(linkIdentifier);
      localStorage.storageArray = JSON.stringify(arrayStore);
    }
    else {
      var newStore = [];
      newStore.push(linkIdentifier);
      localStorage.storageArray = JSON.stringify(newStore);
    }
    //  Shows the notification
    chrome.notifications.create(idKey, options, namespace.logCallback);
    localStorage.count++;
  };

  //  The handler for onclick method of the notifications. Set in background.js
  namespace.notificationId = function(id){
    var linkArray = JSON.parse(localStorage.storageArray);
    var found = linkArray.filter(function(link) {
      return link.identifier[0] === id;
    });
    debugger;
    if(found) {
      chrome.tabs.create({ url: found.identifier[1], active: true });
    }
    // for(var i = 0; i < linkArray.length; i++) {
    //   if(linkArray[i].identifier[0] === id) {
    //     chrome.tabs.create({url: linkArray[i].identifier[1], active: true});
    //   }
    // }
  };

  //  Need this function, gets called when a notification is shown.
  namespace.logCallback = function(id){
    // Currently do nothing
  };
})(sharedFunctions);
