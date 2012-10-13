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


function GetImageURL(category, filename) {
	/// <summary>
	/// Gets chrome extension URL of given image filename and category
	/// </summary>
	/// <param name="category">Category of image</param>
	/// <param name="filename">Filename of image (must include extension)</param>
	/// <returns>String URL of image with given filename in given category</returns>

	return GetURL("Images/" + category + "/" + filename);
};

function GetURL(path) {
	/// <summary>
	/// Gets chrome extension URL of given path
	/// </summary>
	/// <param name="path">Path of URL</param>
	/// <returns>String URL to given path</returns>

	return chrome.extension.getURL(path);
};

function GetPluginImage(metadata) {
	/// <summary>
	/// Gets specified plugin image URL
	/// </summary>
	/// <param name="metadata">Metadata of plugin</param>
	/// <returns>String URL of image for specified plugin</returns>

	return GetURL("Plugins/" + metadata.Category + "/" + metadata.Name + "/Image.png");
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

function Error(message) {
	/// <summary>
	/// Writes console error message
	/// This only works if development mode is set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsDevelopmentMode) {
		console.error(message);
	}
};

function Warn(message) {
	/// <summary>
	/// Writes console warning message
	/// This only works if development mode is set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsDevelopmentMode) {
		console.warn(message);
	}
};

function Log(message) {
	/// <summary>
	/// Writes console message
	/// This only works if development mode is set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsDevelopmentMode) {
		console.log(message);
	}
};

function DLog(message) {
	/// <summary>
	/// Writes console Debug message
	/// This only works if debug and development modes are set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsDebugMode == true && IsDevelopmentMode == true) {
		console.log(message);
	}
};

/// <summary>
/// Writes and warning containing a copy of given object
/// </summary>
/// <param name="obj">Object to debug</param>
function Debug(obj) {
	Warn(JSON.parse(JSON.stringify(obj)));
};


function GetKeyByValue(obj, value) {
	/// <summary>
	/// Gets key by searching for given value in array/object
	/// </summary>
	/// <param name="obj">Objetct or Array to get keys and values from</param>
	/// <param name="value">First value for which to find key</param>
	/// <returns>Object representing key of given value</returns>

	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			if (obj[prop] === value)
				return prop;
		}
	}
};

function ArrayAdd(array, obj) {
	/// <summary>
	/// Adds object to end of array
	/// </summary>
	/// <param name="array">Array to which to add object to</param>
	/// <param name="obj">Object to add</param>

	if (!array) return;

	array[array.length] = obj;
};

function IsNullOrEmpty(obj) {
	/// <summary>
	/// Checks if object is null or empty
	/// </summary>
	/// <param name="obj">Object to check</param>
	/// <returns>True of object eveluetes as null or empty (obj.length == 0)</returns>

	return obj == null || !obj || obj.length == 0;
};

/**
 * Transforms given time string into hours number
 *
 * @author Aleksandar Toplek
 *
 * @param {String} time     Time as string
 *
 * @return {Number} Hours as number
 *                  For input [02:19:59] output would be [2.333055555555556]
 */
function ConvertTimeToHours(time) {
	var split = time.split(":");

	var hours = parseInt(split[0], 10) + (parseInt(split[1], 10) / 60) + (parseInt(split[2], 10) / 3600);

	return hours;
};

/**
 * Transforms given hours number to time string
 *
 * @author Aleksandar Toplek
 *
 * @param {Number} hours    Number representing hours (e.g. 1.253343333, ...)
 *
 * @return {String} Time as string
 *                  For input [2.333055555555556] output would be [02:19:59]
 *
 * @private
 */
function ConvertHoursToTime(hours) {
	var _hours = hours;
	_hours = Math.floor(_hours);
	hours -= _hours;
	hours *= 60;

	var _minutes = hours;
	_minutes = Math.floor(_minutes);
	hours -= _minutes;
	hours *= 60;

	var _seconds = parseInt(hours, 10);
	//_seconds = Math.floor(_seconds);

	return (_hours < 10 ? '0' + _hours : _hours) + ":" +
    (_minutes < 10 ? '0' + _minutes : _minutes) + ":" +
    (_seconds < 10 ? '0' + _seconds : _seconds);
};

function EnsureParams(object, required) {
	// TODO implement
	for (var index = 0; index < args.length; index++) {
		console.warn(args[index]);
	}
};