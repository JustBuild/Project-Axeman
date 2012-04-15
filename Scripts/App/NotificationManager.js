/************************************************
 * Notifications.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		25.02.2012.
 *
 ***********************************************/

/************************************************
 *
 * Notification class to store simple
 * notification data
 *
 ***********************************************/
function Notification(image, header, message, timeout) {
	this.image = image;
 	this.header = header;
 	this.message = message;
 	this.timeout = timeout;
}

/************************************************
 *
 * Notification manager class
 *
 * THIS CLASS USES chrome WEBKITNOTIFICATION
 * AND NEEDS TO HAVE PERMISSION
 *
 * Run this from BackgroundScript
 *
 ***********************************************/
function NotificationManager() {
	/********************************************
	 *
	 * Shows simple notification
	 *
	 *******************************************/
	this.Show = function(notification) {
		// Creates new notification object
		var notification = webkitNotifications.createNotification(
			notification.image, 
			notification.header, 
			notification.message);

		// Shows notification window
		notification.show();

		// Sets notification timeout to given value or default (5000 ms)
		setTimeout(function() { notification.cancel(); }, notification.timeout || 5000);
	}
}
