/*
 * Notification.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		25.02.2012.
 *
 */

 // Definitions
 var Notification = {
 	"Show": 				Show,
 	"NotificationObject": 	NotificationObject
 }

// TODO: Comment function
function Show(notificationObject) {
	notificationObject.Show();
}

 // TODO: Comment object
 function NotificationObject(image, header, message, timeout) {
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
