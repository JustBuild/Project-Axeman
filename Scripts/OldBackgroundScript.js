/*

    BackgroundScript.json

    by
    Aleksandar Toplek,
    JustBuild 2011.

    LICENSE: 

        Copyright 2011 JustBuild Development. All rights reserved.

        Redistribution and use in source and binary forms, with or without 
        modification, are permitted provided that the following conditions 
        are met:

            1. Redistributions of source code must retain the above copyright 
               notice, this list of conditions and the following disclaimer.

            2. Redistributions in binary form must reproduce the above copyright 
               notice, this list of conditions and the following disclaimer in 
               the documentation and/or other materials provided with the 
               distribution.

        THIS SOFTWARE IS PROVIDED BY JUSTBUILD DEVELOPMENT ''AS IS'' AND ANY 
        EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
        IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR 
        PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JUSTBUILD DEVELOPMENT OR
        CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
        EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
        PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
        PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
        LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
        NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
        SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

        The views and conclusions contained in the software and documentation 
        are those of the authors and should not be interpreted as representing 
        official policies, either expressed or implied, of JustBuild Development

*/

var notificationTimeout = 5000;

init();

function init() {
	chrome.extension.onRequest.addListener(gotRequest);
}

function gotRequest(request, sender, sendResponse) {
	console.log("gotRequest - request: { Category: " + request.Category + ", Name: " + request.Name + ", Action: " + request.Action + ", Data: " + request.Data + " }");
	
    if (request.Category === "Extension") {
    	requestExtension(request.Name, request.Action, { Data: request.Data, Sender: sender }, sendResponse);
    }
    else if (request.Category === "Data") {
        requestData(request.Name, request.Action, request.Data, sendResponse);
    }
    else if (request.Category === "Session") {
    	requestData(request.Name, request.Action, request.Data, sendResponse, sessionStorage);
    }
    else if (request.Category === "Travian") {
    	requestTravian(request.Name, request.Action, request.Data, sendResponse);
    }
    else console.warn("Unknown category!");
}

function requestExtension(name, action, data, callback) {
	if (name === "ShowActionPage") {
		chrome.pageAction.show(data.Sender.tab.id);
		callback("ActionPageShown");
	}
	else if (name === "ShowNotification") {
		createNotifiSimple(data.Data.Image, data.Data.Title, data.Data.Message, notificationTimeout);
	}
	else if (name === "ShowNotificationHTML") {
		createNotifiHTML(data.Data.href, notificationTimeout);
	}
}

function createNotifiSimple(image, title, message, timeout) {
	var notification = webkitNotifications.createNotification(resolveImage(image), title, message);
	
	notification.show();
	
	setTimeout(function () {
		notification.cancel();
	}, timeout || 5000);
}

function resolveImage(name) {
	switch (name) {
		case "WoodResource":
			return "../Images/WoodResource.png";
		case "ClayResource":
			return "../Images/ClayResource.png";
		case "IronResource":
			return "../Images/IronResource.png";
		case "CropResource":
			return "../Images/CropResource.png";
		default:
			return "../Images/ProjectAxeman.png";
	}
}

function createNotifiHTML(pageURL, timeout) {
	var notification = webkitNotifications.createHTMLNotification(pageURL);

	notification.show();
	
	setTimeout(function () {
		notification.cancel();
	}, timeout || 5000);
}

function requestTravian(name, action, data, callback) {
	
}

function requestData(name, action, data, callback, source) {
	if (action === "set") {
		var success = _setVariable(name, data, source || localStorage);
		callback(success);
	}
	else {
		var response = _getVariable(name, source || localStorage);
		callback(response);
	}
}

function _getVariable(name, source) {
	var returnValue = source.getItem(name);
    console.log("_getVariable - Data " + name + " GET [" + returnValue + "]");
    return returnValue;
}

function _setVariable(name, value, source) {
	try {
        source.setItem(name, value);
        console.log("_setVariable - Data " + name + " SET [" + value + "]");
        
        return true;
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
        	//data wasnt successfully saved due to quota exceed so throw an error
            console.error("_setVariable - Quota exceeded!"); 
        }
        else console.error("_setVariable - Unknown error!");
        
        return false;
    }
}