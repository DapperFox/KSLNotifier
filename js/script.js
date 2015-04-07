var kslExtension = window.kslExtension || {};
(function (namespace) {
	namespace.displayItems = function(kslItemsArray)
	{
		$liveInfo = $('#liveInfo');
		var $title = kslItemsArray[0];
		var $link = kslItemsArray[1];
		var $description = kslItemsArray[2];
		var $date = kslItemsArray[3];
		for(var i = 0; i < $title.length; i++)
		{
			$liveInfo.append('<a href="'+$link[i]+'">'+$title[i]+'<div class="date"> '+$date[i]+'</div></a>');
		}
	};
	//
	//	Function gets the feed from the url passed in. Check to make sure the response
	//	is good and then calls a method that will parse the response.
	//
	namespace.getFeed = function(url, parser) {
		var xmlRequest = new XMLHttpRequest();
		var $loading = $('#loading');
		//	This is called when .send is called
		xmlRequest.onreadystatechange = function(data){
			if(xmlRequest.readyState == 4){
				if(xmlRequest.status == 200)
				{
					$loading.hide();
					var response = xmlRequest.responseText;
					parser(response);
				}
				else{
					parser(null);
				}
			}
		};
		$loading.show();
		xmlRequest.open('GET', url, true);
		xmlRequest.send();
	};
	//
	//	Function that parses the xml file passed in
	//
	namespace.parseFeed = function(xmlResponse)
	{
		if(xmlResponse === null)
		{
			return null;
		}
		var xmlDoc = $.parseXML(xmlResponse);
		$xml = $(xmlDoc);
		//	need to parse here!
		var $title = $xml.find("item title");
		var $link = $xml.find("item link");
		var $description = $xml.find("item description");
		var $date = $xml.find("item pubDate");
		var titleItems = [];
		var linkItems = [];
		var descriptionItems = [];
		var dateItems = [];

		$title.each(function(){
			titleItems.push($(this).text());
		});
		$link.each(function(){
			linkItems.push($(this).text());
		});
		$description.each(function(){
			descriptionItems.push($(this).text());
		});
		$date.each(function(){
			var removeTime = $(this).text().split('-');
			dateItems.push(removeTime[0]);
		});

		var kslItems = new Array(titleItems, linkItems, descriptionItems, dateItems);
		namespace.displayItems(kslItems);
	};
	//	Event handler that gets called when the category that is selected in options is selected
	namespace.storageHandle = function(storage){
		if(storage.selectedCategory === "")
		{
			chrome.tabs.create({url: chrome.extension.getURL("options.html"), selected: true});
		}
		else
		{
		var splitCategory = storage.selectedCategory.split(",");
		var category = LookupCategories[splitCategory[0]][splitCategory[1]];
		namespace.getFeed('http://www.ksl.com/resources/classifieds/rss_.xml' + category, function(xmlResponse){
			namespace.parseFeed(xmlResponse);});
		}
	};
	$(document).ready(function(){
		//	Gets the category from storage set in the options
		chrome.storage.local.get(
			'selectedCategory', namespace.storageHandle);
	});
})(kslExtension); 