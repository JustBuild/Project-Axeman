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
	var loadNumber = 1;
	var currentLoad = 0;

	this.pluginsManager = new PluginsManager();

	/**************************************************************************
	 *
	 * Application entry point
	 * 
	 *************************************************************************/
	this.Initialize = function () {
		Log("App: Initialization started...");

		// Default settings
		$.ajaxSetup({ cache: false });

		// Inject Project Axeman styles
		$("head").append("<link href='" + GetURL("Pages/PAStyles.css") + "' type='text/css' rel='stylesheet' />");

		// Initialize Modal View
		this.InitializeModalView();
		this.isModalViewActive = false;

		// Get active page
		this.GetActivePage();

		this.Load();
	};

	var LoadProfiles = function () {
		/// <summary>
		/// Sends request and loads available user profiles
		/// </summary>

		DLog("App: Requesting profiles list...");

		var profilesRequest = new Request("Background", "Data", "Profiles", "get", null);
		profilesRequest.Send(function (response) {
			// Check if response is valid
			if (IsNullOrEmpty(response)) {
				DLog("App: No profiles found...");
				DLog("App: Creating new profiles list...");

				AvailableProfiles = new Array();
			}
			else {
				// Parse response
				AvailableProfiles = JSON.parse(response) || new Array();

				DLog("App: Recieved [" + AvailableProfiles.length + "] profile(s)");
			}

			// Calls for loading finished for this request
			CheckFinishedLoading();
		});
	};

	this.Load = function () {
		/// <summary>
		/// Loads all variables needed for further initialization
		/// </summary>

		Log("App: Loading...");

		// Loading available user profiles
		LoadProfiles();
	};

	var CheckFinishedLoading = function () {
		/// <summary>
		/// Increments number of current loads and checks if it is equal 
		/// to needed loads, if so calls initialization finalization
		/// </summary>

		DLog("App: Loaded [" + (currentLoad + 1) + " of " + loadNumber + "]");

		if (++currentLoad >= loadNumber) {
			// If loading finished, finalize initialization
			app.InitializeFinalize();
		}
	};

	this.InitializeFinalize = function () {
		/// <summary>
		/// Finazlizes initialization process
		/// </summary>

		Log("App: Finalizing initialization...");

		// Register plugins
		this.pluginsManager.Initialize();
	};

	/**************************************************************************
	 *
	 * Gets pathnames of current page and saves it to variables
	 *
	 **************************************************************************/
	this.GetActivePage = function () {
		Log("App: Reading current page...");

		var currentAddress = window.location.hostname;
		var currentPath = window.location.pathname;
		var currentQuery = window.location.search;

		DLog("App: Current page address [" + currentAddress + "]");
		DLog("App: Current page pathname [" + currentPath + "]");
		DLog("App: Current page query [" + currentQuery + "]");

		ActiveServerAddress = currentAddress;
		ActivePage = GetKeyByValue(Enums.TravianPages, currentPath);
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
		var imageURL = GetImageURL("Notifications", "ProjectAxeman.png");
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
		Log("App: Initializing ModalView");

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

		Log("App: ModalView injected to the page");
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
			DLog("App: Modal already oppened!");
			return false;
		}

		DLog("App: ModalView shown");

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
			DLog("App: Modal already hidden!");
			return false;
		}

		DLog("App: ModalView hidden");

		// Slide modal view away
		$("#PAModalView").hide("slide", { direction: "right" }, 500);

		app.isModalViewActive = false;
		return true;
	};
}