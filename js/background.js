//  Runs the notification on ready and sets the interval every to poll every so often
var sharedFunctions = window.sharedFunctions || {};
$(document).ready(function(){
  sharedFunctions.startNotifications();
  var interval = setInterval(sharedFunctions.startNotifications, 30000);
  chrome.notifications.onClicked.addListener(sharedFunctions.notificationId);
  if(!localStorage.count) {
    localStorage.count = 0;
  }
});