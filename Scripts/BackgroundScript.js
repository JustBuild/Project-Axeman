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
	requestManager.Recieve("Background", GotRequest);
}


// TODO: Comment function
function GotRequest(request, sender, sendResponse) {
	Helpers.DLog("Got request { requestSign: " + request.requestSign + ", requestCategory: " + request.requestCategory + ", requestName: " + request.requestName + ", actionName: " + request.actionName + ", requestData: " + request.requestData + " }");

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
	Helpers.DLog("BackgroundScript: Got Notification request.");

	if (request.actionName == "Show") {
		notificationManager.Show(request.requestData);
	}
}

function GotDataRequest(request, response) {
	Helpers.DLog("BackgroundScript: Got Data request.");

	if (request.actionName == "get") {
		var data = localStorage.getItem(request.requestName);

		Helpers.Log("BackgroundScript: Data '" + request.requestName + "' GET [" + data + "]");

		response(data);
	}
	else if (request.actionName == "set") {
		try {
			localStorage.setItem(reque.requestName, req.requestData);
			Helpers.Log("BackgroundScript: Data '" + request.requestName + "' SET [" + request.requestData + "]");
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				// Data wasnt successfully saved due to quota exceed so throw an error
				Helpers.Error("_setVariable - Quota exceeded!");
			}
			else Helpers.Error("_setVariable - Unknown error!");
		}
	}
}