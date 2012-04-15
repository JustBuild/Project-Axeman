/************************************************
 * App.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 ***********************************************/

/************************************************
 *
 * Application class
 *
 * Initialize object of this class to start
 * using extension on current website
 *
 ***********************************************/
function App() {
	/********************************************
	 * VARIABLES
	 *******************************************/
	this.availablePlugins = [
		DevelopmentToolbar
	]

	/********************************************
	 *
	 * Application entry point
	 * 
	 *******************************************/
	this.Initialize = function() {
		// Register plugins
		this.RegisterPlugins(this.availablePlugins);

		// Call test function if in development mode
		if (IsDevelopmentMode) {
			this.TestFunction();
		}
	}

	/********************************************
	 *
	 * Test method
	 *
	 * Start this only in development mode
	 *
	 *******************************************/
	this.TestFunction = function () {
		// NotificationManager test
		var notification = new Notification(Helpers.GetImageURL("Notifications", "ProjectAxeman.png"), "Project Axeman", "Test message", 1000);
		var request = new Request("Background", "Notification", "Simple", "Show", notification);
		request.Send(null);
	}

	/********************************************
	 *
	 * Registers all available plugins from
	 * the list passed
	 *
	 *******************************************/
	this.RegisterPlugins = function(pluginsToRegister) {
		for (var index in pluginsToRegister) {
			(new pluginsToRegister[index]).Register();
		}
	}
}