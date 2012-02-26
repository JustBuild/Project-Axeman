/*
 * Request.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 */

 // Definition
 var Request = {
 	"RequestObject": 	RequestObject,
 	"Send": 			Send,
 	"Recieve": 			Recieve
 };




// TODO: Comment object
function RequestObject(requestSign, requestCategory, requestName, actionName, requestData) {
	this.requestSign = requestSign,
	this.requestCategory = requestCategory,
	this.requestName = requestName,
	this.actionName = actionName,
	this.requestData = requestData
};

// TODO: Comment function
function Recieve(sign, callback) {
	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (sign == request.requestSign) {
				callback(request, sender, sendResponse);
			}
		}
	);
};

/*
 * Sends request with data and callback to 
 * listener. 
 *
 * callback can be {Null} - in that case it is
 *          replaces with empty funtion call    
 */
 function Send(request, callback) {
 	chrome.extension.sendRequest(request, callback || function() {});
 };