//	Runs the notification on ready and sets the interval every to poll every so often
$(document).ready(function(){
	shared.startNotifications();
	var interval = setInterval(shared.startNotifications, 30000);
	chrome.notifications.onClicked.addListener(shared.notificationId);
	if(!localStorage.count)
	{
		localStorage.count = 0;
	}
});