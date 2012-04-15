/*
 * Notifications.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		25.02.2012.
 *
 */

// Definitions
/*
var NotificationManager = {
	"Show": 				Show,
	"Notification": 		Notification
};
*/

function Notification(image, header, message, timeout) {
 	this.image = image,
 	this.header = header,
 	this.message = message,
	this.timeout = timeout
}

function NotificationManager() {
	/********************************************
	 *
	 * Shows simple notification
	 *
	 *******************************************/
	 // TODO: Comment
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

// TODO: Comment object


 // TODO: Comment function
 /*
function Show(notification) {
	// Creates new notification object
	var notification = webkitNotifications.createNotification(
		notification.image, 
		notification.header, 
		notification.message);

	// Shows notification window
	notification.show();

	// Sets notification timeout to given value or default (5000 ms)
	setTimeout(function() { notification.cancel(); }, notification.timeout || 5000);
};
*/
