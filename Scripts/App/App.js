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
	var notification = new Notifications.Notification(null, "Project Axeman", "Test message", 5000);

	// Requests test
	var request = new Requests.Request("Background", "Notification", "Simple", "Show", notification);
	request.Send(null);

	App.RegisterPlugins();
}


// TODO: Comment function
function RegisterPlugins() {
	DevelopmentToolbar.Register();
}