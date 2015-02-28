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
		TravianURLMatchesKey: "PATravianServerMatches"
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

		// Check if localStorage is supported
		if (typeof (localStorage) == 'undefined') {
			isLocalStorageSupported = false;
			console.error("localStorage not found! Try updating your browser!");
		}

		// Attach listener to all request signs
		requestManager.Recieve("*", GotRequest);


		if (!IsDevelopmentMode) {
			// Google analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-33221456-3']);
			_gaq.push(['_trackPageview']);

			(function () {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
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
			//		Data
			//		Action
			switch (request.Category) {
				case "Data": {
					GotDataRequest(request, sendResponse);
					break;
				}
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

	var GotDataRequest = function (request, sendResponse) {
		/// <summary>
		/// Handles data requests
		/// </summary>
		/// <param name="request">Request object</param>
		/// <param name="sendResponse">Response function</param>

		console.log("Got Data request [" + request.Data.Type + "]");

		if (request.Data.Type == "get") {
			sendResponse(GetObject(request.Name));
		}
		else if (request.Data.Type == "set") {
			SetObject(request.Name, request.Data.Value);
		}
		else {
			console.error("Unknown Data request Type [" + request.Data.Type + "]");
			console.error(request);
		}
	};

	var ActionIsFirstPlay = function () {
		/// <summary>
		/// Handles IsFirstPlay action request
		/// </summary>
		
		if (!GetObject("IsFirstPlay")) {
			chrome.tabs.create({ url: GetURL("Pages/Welcome/Welcome.html") });
			SetObject("IsFirstPlay", { State: "AlreadyPlayed" });
		};
	};

	var ActionReloadExtension = function() {
		chrome.tabs.create({ url: "http://reload-extension/", active: false });
	};

	var ActionsAvailable = {
		/// <summary>
		/// List of actions that can be called
		/// </summary>
		
		IsFirstPlay: ActionIsFirstPlay,
		ReloadExtension: ActionReloadExtension
	};
	
	var SetObject = function (key, value) {
		/// <summary>
		/// Sets object to localStorage as <key, value> pair
		/// This function will automatically stringify given object.
		/// </summary>
		/// <param name="key">Key object</param>
		/// <param name="value">Value object</param>
		
		try {
			localStorage.setItem(key, JSON.stringify(value));
			console.log("Set Data [" + key + "] Value");
			console.log(value);
		}
		catch (exception) {
			if (exception.name === 'QUOTA_EXCEEDED_ERR' ||
				exception.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
				console.error("Quota exceeded! Clear localStorage to solve problem. WARNING: Clearing localStorage will delete all user data.");
			}
			else {
				console.error("Unknown error while trying to set an item \"" + key + "\" with value: ");
				console.log(value);
			}
		}
	};

	/// <summary>
	/// Gets object from localStorage as value for given key
	/// This function will automatically parse localStorage value and return object type
	/// </summary>
	/// <param name="key">Key object</param>
	/// <returns>Object from localStorage that corresponds to given key</returns>
	var GetObject = function (key) {
		var value = localStorage.getItem(key);
		var parsedValue = value && JSON.parse(value);
		console.log("Get Data [" + key + "] Value");
		console.log(parsedValue);
		return parsedValue;
	};
};

// TODO: Comment function
//function GotNotificationRequest(request) {
//	console.log("Got Notification request.");

//	if (request.actionName == "Show") {
//		notificationManager.Show(request.requestData);
//	}
//}