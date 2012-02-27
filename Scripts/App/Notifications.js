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
 var Notifications = {
 	"Show": 				Show,
 	"Notification": 		Notification
 }

// TODO: Comment function
function Show(notificationObject) {
	notificationObject.Show();
}

 // TODO: Comment object
 function Notification(image, header, message, timeout) {
 	this.image = image,
 	this.header = header,
 	this.message = message,
 	this.timeout = timeout,

 	this.Show = function() {
 		var notification = webkitNotifications.createNotification(
 			this.image, this.title, this.message);

 		notification.show();

 		setTimeout(function() {
 			notification.cancel();
 		}, this.timeout || 5000);
 	}
 }
