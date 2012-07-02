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

 // Public Definition
var BackgroundScript = {
	"Initialize": 		Initialize
};

// Variables
notificationManager = new NotificationManager();
requestManager = new RequestManager();


// This is called since there is no launcher
// as there is for App script
BackgroundScript.Initialize();

// TODO: Comment function 
function Initialize() {
	//if (typeof(localStorage) == 'undefined') {
	//	alert('Your browser does not support HTML5 localStorage. Try upgrading.');
	//}

	requestManager.Recieve("Background", GotRequest);
}


// TODO: Comment function
function GotRequest(request, sender, sendResponse) {
	DLog("Got request { requestSign: " + request.requestSign + ", requestCategory: " + request.requestCategory + ", requestName: " + request.requestName + ", actionName: " + request.actionName + ", requestData: " + request.requestData + " }");

	// Supports following categories
	//		Notification
	//		Data
	switch (request.requestCategory) {
		case "Notification": GotNotificationRequest(request); break;
		case "Data": GotDataRequest(request, sendResponse); break;
		default:
			console.error("BackgroundScript: Unknown category!", request);
			break;
	}
}

// TODO: Comment function
function GotNotificationRequest(request) {
	DLog("BackgroundScript: Got Notification request.");

	if (request.actionName == "Show") {
		notificationManager.Show(request.requestData);
	}
}

function GotDataRequest(request, response) {
	DLog("BackgroundScript: Got Data request.");

	// On GET request
	if (request.actionName == "get") {
		// Get data from storage by requestName
		var data = localStorage.getItem(request.requestName);

		Log("BackgroundScript: Data '" + request.requestName + "' GET [" + data + "]");

		// Send data back in response
		response(data);
	}
	// ON SET request
	else if (request.actionName == "set") {
		try {
			// Check if data needs to be stringifyed
			if (typeof request.requestData != "string") {
				request.requestData = JSON.stringify(request.requestData);
			}

			// Save data to storage
			localStorage.setItem(request.requestName, request.requestData);

			Log("BackgroundScript: Data '" + request.requestName + "' SET [" + request.requestData + "]");
		} catch (e) {
			if (e != null) {
				// Data wasnt successfully saved due to quota exceed so throw an error
				Error("BackgroundScript:  Quota exceeded!");
				Warn("BackgroundScript: " + localStorage.length);
				alert("Quota exceded! Can't save any changes for Project Axeman");
			}
			else {
				Error("BackgroundScript:  Unknown error!");
				alert("Unknown error! Can't save any changes for Projrct Axeman");
			}
		}
	}
}