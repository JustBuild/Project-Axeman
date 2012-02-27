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
	var request = new Requests.Request("Background", "Notification", "ShowSimple", "Action", null);
	request.Send(null);

	App.RegisterPlugins();
}


// TODO: Comment function
function RegisterPlugins() {
	DevelopmentToolbar.Register();
}