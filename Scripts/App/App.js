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
		// Check development and debug mode
		var developmentModeRequest = new Request("Background", "Data", "IsDevelopmentMode", "get", null);
		var debugModeRequest = new Request("Background", "Data", "IsDebugMode", "get", null);
		developmentModeRequest.Send(function (response) {
			IsDevelopmentMode = (response == "true" ? "true" : "false");
			if (IsDevelopmentMode) Helpers.Log("Development mode.");
		});
		debugModeRequest.Send(function (response) {
			IsDebugMode = (response == "true" ? "true" : "false");
			if (IsDebugMode) Helpers.Log("Debug mode.");
		});

		// Default settings
		$.ajaxSetup({ cache: false });

		// Inject Project Axeman styles
		$("head").append("<link href='" + Helpers.GetExtensionRootURL("Pages/PAStyles.css") + "' type='text/css' rel='stylesheet' />");

		// Initialize Modal View
		this.InitializeModalView();
		this.isModalViewActive = false;

		// Get active page
		this.GetActivePage();

		// Register plugins
		this.pluginsManager.Initialize();

		// Call test function if in development mode
		if (IsDevelopmentMode) {
			this.TestFunction();
		}
	};

	/**************************************************************************
	 *
	 * Gets pathnames of current page and saves it to variables
	 *
	 **************************************************************************/
	this.GetActivePage = function () {
		Helpers.Log("App: Reading current page...");

		var currentPath = window.location.pathname;
		var currentQuery = window.location.search;

		Helpers.DLog("App: Current page pathname [" + currentPath + "]");
		Helpers.DLog("App: Current page query [" + currentQuery + "]");

		ActivePage = Enums.TravianPages[currentPath];
		ActivePageQuery = currentQuery;
	};

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
	};


	/**************************************************************************
	 *
	 * Initializes Moval View
	 *
	 * This function will inject modalview <div> tag onto page. This will
	 * be used to slide in/out pages so that user can change settings
	 * or see some additional information.
	 *
	 *************************************************************************/
	this.InitializeModalView = function () {
		Helpers.Log("App: Initializing ModalView");

		// Appends modal view 
		var source = "<div id='PAModalView' class='ModalView'></div>";
		$("body").append(source);

		// Attach function to click and keyup events
		// so that we close modalview when user clicks
		// outside of modalview (on document not on modalview)
		$(document).bind('click keyup', function (e) {
			// If this is a keyup event, let's see if it's an ESC key
			if (e.type == "keyup" && e.keyCode != 27) return;

			// Make sure it's visible, and we're not modal	    
			if (app.isModalViewActive == true &&						// Check if modal is active
				e.target.className != "ModalView" &&					// Check that click target is not modal view
				$(e.target).parents().index($("#PAModalView")) < 0) {	// Check that click target are not modal view children
				app.HideModalView();
			}
		});

		Helpers.Log("App: ModalView injected to the page");
	};

	/**************************************************************************
	 *
	 * Slides in ModalView if it is hidden and shows given content on it
	 *
	 * Returns true if modalview is successfully shown
	 *
	 *************************************************************************/
	this.ShowModalView = function (content) {
		// Return if modelview is already active
		if (app.isModalViewActive == true) {
			Helpers.DLog("App: Modal already oppened!");
			return false;
		}

		Helpers.DLog("App: ModalView shown");

		// Changes content of modelview
		$("#PAModalView").html(content);

		// Slide modal view in
		$("#PAModalView").show("slide", { direction: "right" }, 500);

		app.isModalViewActive = true;
		return true;
	};

	/**************************************************************************
	 *
	 * Slides out ModalView if it is shown
	 *
	 * Returns true if modalview is successfully hidden
	 *
	 *************************************************************************/
	this.HideModalView = function () {
		// Return if modalview is already hidden
		if (app.isModalViewActive == false) {
			Helpers.DLog("App: Modal already hidden!");
			return false;
		}

		Helpers.DLog("App: ModalView hidden");

		// Slide modal view away
		$("#PAModalView").hide("slide", { direction: "right" }, 500);

		app.isModalViewActive = false;
		return true;
	};
}