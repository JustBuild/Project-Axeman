/*
 * App.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 */

// Definitions
var App = {
	"Start": 				Start,
	"RegisterPlugins": 		RegisterPlugins
};

/*
 * Application entry point
 */
function Start() {
	// Requests test
	var notification = new NotificationManager.Notification(null, "Project Axeman", "Test message", 1000);
	var request = new RequestManager.Request("Background", "Notification", "Simple", "Show", notification);
	RequestManager.Send(request, null);

	// Register plugins
	App.RegisterPlugins();
}


// TODO: Comment function
function RegisterPlugins() {
	DevelopmentToolbar.Register();
}