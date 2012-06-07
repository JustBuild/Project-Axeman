/******************************************************************************
 * App.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 ******************************************************************************/

/******************************************************************************
 *
 * Application class
 *
 * Initialize object of this class to start
 * using extension on current website
 *
 *****************************************************************************/
function App() {
	this.pluginsManager = new PluginsManager();

	/**************************************************************************
	 *
	 * Application entry point
	 * 
	 *************************************************************************/
	this.Initialize = function () {
		// Get active page
		this.GetActivePage();

		// Register plugins
		this.pluginsManager.Initialize();

		// Call test function if in development mode
		if (IsDevelopmentMode) {
			this.TestFunction();
		}
	}

	/**************************************************************************
	 *
	 * Gets pathnames of current page and saves it to variables
	 *
	 **************************************************************************/
	this.GetActivePage = function() {
		Helpers.Log("App: Reading current page...");

		var currentPath = window.location.pathname;
		var currentQuery = window.location.search;

		Helpers.DLog("App: Current page pathname [" + currentPath + "]");
		Helpers.DLog("App: Current page query [" + currentQuery + "]");

		ActivePage = Enums.TravianPages[currentPath];
		ActivePageQuery = currentQuery;
	}

	/**************************************************************************
	 *
	 * Test method
	 *
	 * Start this only in development mode
	 *
	 *************************************************************************/
	this.TestFunction = function () {
		// NotificationManager test
		var imageURL = Helpers.GetImageURL("Notifications", "ProjectAxeman.png");
		var notification = new Notification(imageURL, "Project Axeman", "Test message", 1000);
		var request = new Request("Background", "Notification", "Simple", "Show", notification);
		request.Send(null);
	}
}