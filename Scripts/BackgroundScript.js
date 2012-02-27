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

BackgroundScript.Initialize();


// TODO: Comment function
function Initialize() {
	Requests.Recieve("Background", GotRequest);
}


function GotRequest(request, sender, sendResponse) {
	Helpers.Log("Got request { requestSign: " + request.requestSign + ", requestCategory: " + request.requestCategory + ", requestName: " + request.requestName + ", actionName: " + request.actionName + ", requestData: " + request.requestData + " }");
}