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

/// <summary>
/// App class
/// This is start class for content script
/// </summary>
function App() {
	var loadNumber = 1;
	var currentLoad = 0;
	var pluginsManager = new PluginsManager();

	/// <summary>
	/// Initializes App object
	/// </summary>
	this.Initialize = function () {
		Log("App: Initialization started...");

		// Default settings
		$.ajaxSetup({ cache: false });

		// Inject Project Axeman styles
		var stylesheet = $("<link>");
		stylesheet.attr("href", GetURL("Pages/PAStyles.css"));
		stylesheet.attr("type", "text/css");
		stylesheet.attr("rel", "stylesheet");
		$("head").append(stylesheet);

		// Initialize Modal View
		this.InitializeModalView();
		this.isModalViewActive = false;

		// Get active page
		this.GetActivePage();

		this.Load();

		// Send request to check if this is first play
		(new Request("Background", "Action", "IsFirstPlay")).Send();
	};

	/// <summary>
	/// Loads all variables needed for further initialization
	/// </summary>
	this.Load = function () {
		Log("App: Loading...");

		// Loading available user profiles
		LoadProfiles();
	};

	/// <summary>
	/// Sends request and loads available user profiles
	/// </summary>
	var LoadProfiles = function () {
		DLog("App: Requesting profiles list...");

		var profilesRequest = new Request("Background", "Data", "Profiles", { Type: "get" });
		profilesRequest.Send(function (response) {
			// Check if response is valid
			if (IsNullOrEmpty(response)) {
				DLog("App: No profiles found...");
				DLog("App: Creating new profiles list...");

				AvailableProfiles = new Array();
			}
			else {
				// Parse response
				AvailableProfiles = response || new Array();

				DLog("App: Recieved [" + AvailableProfiles.length + "] profile(s)");
			}

			// Calls for loading finished for this request
			CheckFinishedLoading();
		});
	};

	/// <summary>
	/// Increments number of current loads and checks if it is equal 
	/// to needed loads, if so calls initialization finalization
	/// </summary>
	var CheckFinishedLoading = function () {
		DLog("App: Loaded [" + (currentLoad + 1) + " of " + loadNumber + "]");

		if (++currentLoad >= loadNumber) {
			// If loading finished, finalize initialization
			InitializationFinalize();
		}
	};

	/// <summary>
	/// Finazlizes initialization process
	/// </summary>
	var InitializationFinalize = function () {
		Log("App: Finalizing initialization...");

		// Register plugins
		pluginsManager.Initialize();
	};

	/// <summary>
	/// Gets pathnames of current page and saves it to variables
	/// </summary>
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

	/// <summary>
	/// Initializes Moval View
	/// This function will inject modalview <div> tag onto page. This will
	/// be used to slide in/out pages so that user can change settings
	/// or see some additional information.
	/// </summary>
	this.InitializeModalView = function () {
		Log("App: Initializing ModalView");

		// Appends modal view 
		var modalViewElement = $("<div>");
		modalViewElement.attr("id", "PAModalView");
		modalViewElement.addClass("ModalView");
		$("body").append(modalViewElement);

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

	/// <summary>
	/// Slides in ModalView if it is hidden and shows given content on it
	/// </summary>
	/// <param name="content">Content string</param>
	/// <returns>Returns true if modalview is successfully shown</returns>
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

	/// <summary>
	/// Slides out ModalView if it is shown
	/// </summary>
	/// <returns>Returns true if modalview is successfully hidden</returns>
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