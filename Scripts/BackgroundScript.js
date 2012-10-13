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
	var notificationManager = new NotificationManager();
	var requestManager = new RequestManager();
	var isLocalStorageSupported = true;

	/// <summary>
	/// Initialize class variables
	/// </summary>
	this.Initialize = function () {
		// Check if localStorage is supported
		if (typeof (localStorage) == 'undefined') {
			isLocalStorageSupported = false;
			Error("BackgroundScript: localStorage not found! Try updating your browser!");
		}

		// Attach listener to "Background" request sign
		requestManager.Recieve("Background", GotRequest);
	};

	/// <summary>
	/// Handles requests for BackgroundScript
	/// </summary>
	/// <param name="request">Request object</param>
	/// <param name="sender">Sender object</param>
	/// <param name="sendResponse">sendResponse function</param>
	var GotRequest = function (request, sender, sendResponse) {
		DLog("BackgroundScript: Got request category [" + request.Category + "]");

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
				Error("BackgroundScript: Unknown category [" + request.Category  + "]");
				break;
			}
		}
	};

	/// <summary>
	/// Handles action requests
	/// </summary>
	/// <param name="request">Request object</param>
	var GotActionRequest = function (request) {
		DLog("BackgroundScript: Got Action request [" + request.Name + "]");

		if (IsNullOrEmpty(request.Name)) {
			Error("BackgroundScript: Invalid action name [" + request.Name + "]");
		}
		else if (!ActionsAvailable[request.Name]) {
			Error("BackgroundScript: Unknown action [" + request.Name + "]");
		}
		else ActionsAvailable[request.Name]();
	};

	/// <summary>
	/// Handles data requests
	/// </summary>
	/// <param name="request">Request object</param>
	/// <param name="sendResponse">Response function</param>
	var GotDataRequest = function (request, sendResponse) {
		DLog("BackgroundScript: Got Data request [" + request.Data.Type + "]");

		if (request.Data.Type == "get") {
			sendResponse(GetObject(request.Name));
		}
		else if (request.Data.Type == "set") {
			SetObject(request.Name, request.Data.Value);
		}
		else {
			Error("BackgroundScript: Unknown Data request Type [" + request.Data.Type + "]");
			Error(request);
		}
	};

	/// <summary>
	/// Handles IsFirstPlay action request
	/// </summary>
	var ActionIsFirstPlay = function () {
		if (!GetObject("IsFirstPlay")) {
			chrome.tabs.create({ url: GetURL("Pages/Welcome.html") });
			SetObject("IsFirstPlay", { State: "AlreadyPlayed" });
		};
	};

	var ActionsAvailable = {
		IsFirstPlay: ActionIsFirstPlay
	};
	
	/// <summary>
	/// Sets object to localStorage as <key, value> pair
	/// This function will automatically stringify given object.
	/// </summary>
	/// <param name="key">Key object</param>
	/// <param name="value">Value object</param>
	var SetObject = function (key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			DLog("BackgroundScript: Set Data [" + key + "] Value [" + value + "]");
		}
		catch (exception) {
			if (exception.name === 'QUOTA_EXCEEDED_ERR' ||
				exception.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
				Error("BackgroundScript: Quota exceeded! Clear localStorage to solve problem. WARNING: Clearing localStorage will delete all user data.");
			}
			else {
				Error("BackgroundScript: Unknown error while trying to set an item!");
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
		DLog("BackgroundScript: Got Data [" + key + "] Value [" + parsedValue + "]");
		return parsedValue;
	};
};

// TODO: Comment function
//function GotNotificationRequest(request) {
//	DLog("BackgroundScript: Got Notification request.");

//	if (request.actionName == "Show") {
//		notificationManager.Show(request.requestData);
//	}
//}