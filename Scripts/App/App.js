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
	var notification = new Notifications.Notification(null, "Project Axeman", "Test message", 1000);
	var request = new Requests.Request("Background", "Notification", "Simple", "Show", notification);
	Requests.Send(request, null);

	// Register plugins
	App.RegisterPlugins();
}


// TODO: Comment function
function RegisterPlugins() {
	DevelopmentToolbar.Register();
}