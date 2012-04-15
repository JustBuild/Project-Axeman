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

function App() {
	/************************************************
	 *
	 * Application entry point
	 * 
	 ***********************************************/
	this.Initialize = function() {
		// Requests test
		//var notification = new NotificationManager.Notification(Helpers.GetImageURL("Notifications", "ProjectAxeman.png"), "Project Axeman", "Test message", 1000);
		var notification = new Notification(Helpers.GetImageURL("Notifications", "ProjectAxeman.png"), "Project Axeman", "Test message", 1000);
		var request = new RequestManager.Request("Background", "Notification", "Simple", "Show", notification);
		RequestManager.Send(request, null);

		// Register plugins
		this.RegisterPlugins();
	}


	this.knownPlugins = [
		DevelopmentToolbar
	]

	/************************************************
	 *
	 * Registers all known plugins
	 *
	 ***********************************************/
	this.RegisterPlugins = function() {
		for(var index in this.knownPlugins) {
			this.knownPlugins[index].Register();
		}
	}
}