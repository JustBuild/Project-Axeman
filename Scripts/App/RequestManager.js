/******************************************************************************
 * Requests.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 *****************************************************************************/

/******************************************************************************
 *
 * Request class to store data
 *
 *****************************************************************************/
function Request(requestSign, requestCategory, requestName, actionName, requestData) {
	this.requestSign = requestSign;
	this.requestCategory = requestCategory;
	this.requestName = requestName;
	this.actionName = actionName;
	this.requestData = requestData;

	/**************************************************************************
	 *
	 * Sends request with data and callback to
	 * listener.
	 *
	 * callback can be {Null} - in that case
	 *          it si replaces with empty
	 *			funtion call
	 *
	 **************************************************************************/
	this.Send = function (request, callback) {
		chrome.extension.sendRequest(this, callback || function () { });
	}
}

/******************************************************************************
 *
 * Request manager class 
 *
 * THIS CLASS USES chrome WEBKITNOTIFICATION
 * AND NEEDS TO HAVE PERMISSION
 *
 * Run this from BackgroundScript
 *
 *****************************************************************************/
function RequestManager() {
	/**************************************************************************
	 *
	 * Adds reciever for specific sign
	 *
	 *************************************************************************/
	this.Recieve = function(sign, callback) {
		chrome.extension.onRequest.addListener(
			function(request, sender, sendResponse) {
				if (sign == request.requestSign) {
					callback(request, sender, sendResponse);
				}
			}
		);
	}
}