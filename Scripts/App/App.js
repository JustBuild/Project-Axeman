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
	"Start": Start
};

/*
 * Application entry point
 */
function Start() {
	var request = new RequestObject("Background", "Settings", "Profile", "Get", null);
	Request.Send(request, null);
}