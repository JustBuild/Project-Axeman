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
	Request.Recieve("Background", GotRequest);
}


function GotRequest(request, sender, sendResponse) {
	Helpers.Log("Got request { requestSign: " + requestSign + ", requestCategory: " + requestCategory + ", requestName: " + requestName + ", actionName: " + actionName + ", requestData: " + requestData + " }");
}