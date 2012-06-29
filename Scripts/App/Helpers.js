/******************************************************************************
 *
 * Helpers.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 *****************************************************************************/

var Helpers = {
	"GetKeyByValue": GetKeyByValue,
	"MatchPages": MatchPages,
	"IsLogedIn": IsLogedIn,
	"GetImageURL": 			GetImageURL,
	"GetExtensionRootURL": GetExtensionRootURL,
	"GetPluginImage": GetPluginImage,
	"Error": 				Error,
	"Warn": 				Warn,
	"Log": 					Log,
	"DLog":  				DLog
};


function IsLogedIn() {
	return $(".signLink") != null;
};

// TODO: Comment function
function GetImageURL(category, filename) {
	return GetExtensionRootURL("Images/" + category + "/" + filename);
};

// TODO: Comment function
function GetExtensionRootURL(path) {
	return chrome.extension.getURL(path);
};

function GetPluginImage(metadata) {
	/// <summary>
	/// Gets specified plugin image
	/// </summary>
	/// <param name="metadata">Metadata of plugin</param>
	/// <returns>URL of image for specified plugin</returns>

	return GetExtensionRootURL("Plugins/" + metadata.Category + "/" + metadata.Name + "/Image.png");
};

function MatchPages() {
	/// <summary>
	/// Matches current active page with given pages
	/// </summary>
	/// <returns>True if there was current active page passed as argument</returns>

	for (var index = 0; index < arguments.length; index++) {
		if (arguments[index] == Enums.TravianPages[ActivePage]) {
			return true;
		}
	}

	return false;
};

// TODO: Comment function
function Error(message) {
	if (IsDevelopmentMode) {
		console.error(message);
	}
};

// TODO: Comment function
function Warn(message) {
	if (IsDevelopmentMode) {
		console.warn(message);
	}
};

// TODO: Comment function
function Log(message) {
	if (IsDevelopmentMode) {
		console.log(message);
	}
};

// TODO: Comment function
function DLog(message) {
	if (IsDebugMode == true && IsDevelopmentMode == true) {
		console.log(message);
	}
};


function GetKeyByValue(obj, value) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			if (obj[prop] === value)
				return prop;
		}
	}
};