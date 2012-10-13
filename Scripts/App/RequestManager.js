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
function Request(requestSign, requestCategory, requestName, requestData) {
	this.Sign = requestSign;
	this.Category = requestCategory;
	this.Name = requestName;
	this.Data = requestData;

	/**************************************************************************
	 *
	 * Sends request with data and callback to
	 * listener.
	 *
	 **************************************************************************/
	this.Send = function (callback) {
		chrome.extension.sendRequest(this, callback || function () { });
	};
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
				if (sign == request.Sign) {
					callback(request, sender, sendResponse);
				}
			}
		);
	}
}