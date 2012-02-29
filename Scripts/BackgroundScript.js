/*
 * BackgroundScript.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		26.02.2012.
 *
 */

 // Public Definition
var BackgroundScript = {
	"Initialize": 		Initialize
};


// This is called since there is no launcher
// as there is for App script
BackgroundScript.Initialize();

// TODO: Comment function 
function Initialize() {
	RequestManager.Recieve("Background", GotRequest);
}


// TODO: Comment function
function GotRequest(request, sender, sendResponse) {
	Helpers.DLog("Got request { requestSign: " + request.requestSign + ", requestCategory: " + request.requestCategory + ", requestName: " + request.requestName + ", actionName: " + request.actionName + ", requestData: " + request.requestData + " }");

	if(request.requestCategory == "Notification") {
		GotNotificationRequest(request);
	}
}

// TODO: Comment function
function GotNotificationRequest(request) {
	Helpers.DLog("Got Notification request.");

	if (request.actionName == "Show") {
		NotificationManager.Show(request.requestData);
	}
}