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

		// Inject Project Axeman styles
		$("head").append("<link href='" + Helpers.GetExtensionRootURL("Pages/PAStyles.css") + "' type='text/css' rel='stylesheet' />");

		// Initialize Modal View
		this.InitializeModalView();

		// Get active page
		this.GetActivePage();

		// Register plugins
		this.pluginsManager.Initialize();

		// Call test function if in development mode
		if (IsDevelopmentMode) {
			this.TestFunction();
		}

		this.ShowModal("<button id='PAModalViewHide'>MODAL TEST</button>");
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


	var isModalOpen = false;

	this.InitializeModalView = function () {
		Helpers.Log("App: Initializing ModalView");

		var source = "<div id='PAModalView' class='ModalView'></div>";
		$("body").append(source);

		Helpers.Log("App: ModalView injected to the page");
	};

	this.ShowModal = function (content) {
		if (isModalOpen == true) {
			Helpers.DLog("App: Modal already oppened!");
			return false;
		}

		$("#PAModalView").html(content);

		$("#PAModalViewHide").click(function () {
			// Hide ModalView function
			if (isModalOpen == false) {
				Helpers.DLog("App: Modal already hidden!");
				return false;
			}

			$("#PAModalView").hide("slide", { direction: "right" }, 500);
			//$("#PAModalView").css("display", "none");

			isModalOpen = false;
			return true;
		});

		//$("#PAModalView").css("display", "block");
		$("#PAModalView").show("slide", { direction: "right" }, 500);

		isModalOpen = true;
		return true;
	}
}