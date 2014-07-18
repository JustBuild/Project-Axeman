/******************************************************************************
 * BackgroundScript.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		26.02.2012.
 *
 *****************************************************************************/

var backgroundScript = new BackgroundScript();
backgroundScript.Initialize();

/// <summary>
/// Background scipt is class that has all chrome.* permissions and can do actions that contentscript can't
/// </summary>
function BackgroundScript() {
	var Settings = {

	};

	var Default = {

	};

	var notificationManager = new NotificationManager();
	var requestManager = new RequestManager();
	var isLocalStorageSupported = true;

	/// <summary>
	/// Initialize class variables
	/// </summary>
	this.Initialize = function () {
		// Initial setup
		InitialSetup();

		// Attach listener to all request signs
		requestManager.Recieve("*", GotRequest);


		if (!IsDevelopmentMode) {
			// Google analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-33221456-3']);
			_gaq.push(['_trackPageview']);

			(function () {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = 'https://ssl.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		}
	};

	var InitialSetup = function () {
		/// <summary>
		/// Sets all data and settings to default if not already set
		/// </summary>
		
		// NOTE Save default values to local storage here
	};

	/// <summary>
	/// Handles requests for BackgroundScript
	/// </summary>
	/// <param name="request">Request object</param>
	/// <param name="sender">Sender object</param>
	/// <param name="sendResponse">sendResponse function</param>
	var GotRequest = function (request, sender, sendResponse) {
		console.log("Got request category [" + request.Category + "]");

		if (request.Sign != "Background") {
			chrome.tabs.sendMessage(sender.tab.id, request);
		} else {
			// Supports following categories
			//		Action
			switch (request.Category) {
				case "Action": {
					GotActionRequest(request);
					break;
				}
				default: {
					console.error("Unknown category [" + request.Category + "]");
					break;
				}
			}
		}
	};

	var GotActionRequest = function (request) {
		/// <summary>
		/// Handles action requests
		/// </summary>
		/// <param name="request">Request object</param>

		console.log("Got Action request [" + request.Name + "]");

		if (IsNullOrEmpty(request.Name)) {
			console.error("Invalid action name [" + request.Name + "]");
		}
		else if (!ActionsAvailable[request.Name]) {
			console.error("Unknown action [" + request.Name + "]");
		}
		else ActionsAvailable[request.Name]();
	};

	var ActionsAvailable = {
		/// <summary>
		/// List of actions that can be called
		/// </summary>
		// Example: 
		// ActionName: ActionFunction
	};
};

// TODO: Comment function
//function GotNotificationRequest(request) {
//	console.log("Got Notification request.");

//	if (request.actionName == "Show") {
//		notificationManager.Show(request.requestData);
//	}
//}