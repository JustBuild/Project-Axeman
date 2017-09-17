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

function SplitURL(theURL) {
    theURL = theURL ? theURL : window.location.href;

    if (theURL.indexOf('?') === -1) {
        return false;
    }

    var fullUrl = theURL.split('?');
    var urlParams = fullUrl[1].split('&');

    gets = new Array();

    for (i = 0; i <= urlParams.length - 1; ++i) {
        var param = urlParams[i].split('=');
        var name = param[0];
        var value = param[1];
        gets[name] = value;
    }
    return gets;
};

function getDistance( point1, point2 ) {
	var xs = 0;
	var ys = 0;

	xs = point2.x - point1.x;
	xs = xs * xs;

	ys = point2.y - point1.y;
	ys = ys * ys;

	var num = Math.sqrt( xs + ys );
	return Math.round(num * 10) / 10;
}

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

function MatchPages(pages) {
	/// <summary>
	/// Matches current active page with given pages
	/// </summary>
	/// <param name="pages">Array of pages that are required to match, if left blank matches to everything</param>
	/// <returns>True if there was current active page passed as argument</returns>

	if (!pages || pages.length === 0) return true;

	for (var index = 0; index < pages.length; index++) {
		if (pages[index] == Enums.TravianPages[ActivePage]) {
			return true;
		}
	}

	return false;
};

function MatchQuery(matchObject) {
	/// <summary>
	/// Matches current active page query with given query parameters
	/// </summary>
	/// <param name="matchObject"></param>
	/// <returns type=""></returns>

	if (arguments.length != 1) {
		Warn("To match query you must pass object containing query parameters!");
		return;
	}

	// Parse current page query
	var queryObject = ParseQuery(ActivePageQuery);

	// Check if there is more arguments requested than are in active page query
	if (matchObject.length > queryObject.length) return false;

	// Check if any argument doesn't match, in that case return false for not match
	for (var i in matchObject) {
		if (!queryObject[i] || !matchObject[i] || queryObject[i] != matchObject[i]) {
			return false;
		}
	}

	return true;
};

function ParseQuery(query) {
	/// <summary>
	/// Reads current location query
	/// </summary>
	/// <returns type="Object">Returns an object that contains parametes from query request</returns>

	var parameters = {};

	// Removes leading questionmark
	query = query.replace("?", "");

	// Split query by '&' symbol
	var hashes = query.split('&');

	// Go through all parameters and add each to array
	for (var index = 0; index < hashes.length; index++) {
		var hash = hashes[index].split('=');
		parameters[hash[0]] = hash[1];
	}

	return parameters;
};

function Error(message, e) {
	/// <summary>
	/// Writes console error message
	/// This only works if development mode is set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (!message) return 0;

	if (IsLogging() && IsDevelopmentMode()) {
		var category = arguments[1] !== undefined ? arguments[1] + ": " : "";
		console.error(category + message, e);
	}
	return 0;
};

function Warn(message, e) {
	/// <summary>
	/// Writes console warning message
	/// This only works if development mode is set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsLogging() && IsDevelopmentMode()) {
		var category = arguments[1] !== undefined ? arguments[1] + ": " : "";
		console.warn("%c" + category + message, "color: #B88E07", e);
	}
};

function Log(message, e) {
	/// <summary>
	/// Writes console message
	/// This only works if development mode is set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsLogging() && IsDevelopmentMode()) {
		var category = arguments[1] !== undefined ? arguments[1] + ": " : "";
		console.log(category + message, e);
	}
};

function DLog(message, e) {
	/// <summary>
	/// Writes console Debug message
	/// This only works if debug and development modes are set to true
	/// </summary>
	/// <param name="message">Message to write</param>

	if (IsLogging() && IsDevelopmentMode()) {
		var category = arguments[1] !== undefined ? arguments[1] + ": " : "";
		console.log("%c" + category + message, "color: #AAAAAA", e);
	}
};

function DebugObj(obj) {
	/// <summary>
	/// Writes and warning containing a copy of given object
	/// </summary>
	/// <param name="obj">Object to debug</param>

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

function ConvertTimeToHours(time) {
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

	var split = time.split(":");

	var hours = parseInt(split[0], 10) + (parseInt(split[1], 10) / 60) + (parseInt(split[2], 10) / 3600);

	return hours;
};

function ConvertSecondsToTime(seconds) {
	// TODO Comment

	var hours = Math.floor(seconds / 3600);
	var minutes = Math.floor((seconds - hours * 3600) / 60);
	var seconds = Math.floor(seconds - minutes * 60 - hours * 3600);

	return hours.PadLeft(2) + ":" +
			minutes.PadLeft(2) + ":" +
			seconds.PadLeft(2);
};

Number.prototype.PadLeft = function (length, digit) {
	// TODO Comment

	var str = '' + this;

	while (str.length < length) {
		str = (digit || '0') + str;
	}

	return str;
};

function EnsureParams(object, required) {
	// TODO implement
	for (var index = 0; index < args.length; index++) {
		console.warn(args[index]);
	}
};

function CreateStylesheet(path) {
	/// <summary>
	/// Creates link object to given stylesheet.
	/// In order to insert stylesheet into page through this plugin, stylesheet must be listen in minefest.json as external resource
	/// </summary>
	/// <param name="path">Relative path to stylesheet file in extension files</param>
	/// <returns type="">jQuery object that can be inserted into page</returns>

	var stylesheetLink = $("<link>");
	stylesheetLink.attr("href", GetURL(path));
	stylesheetLink.attr("type", "text/css");
	stylesheetLink.attr("rel", "stylesheet");

	return stylesheetLink;
}

function NumberWithCommas(x) {
	/// <summary>
	/// Transforms number into grouped digit number.
	/// Group of three digits
	/// </summary>
	/// <param name="x">Number to transform</param>
	/// <returns type="">string number with comas after group of four digits</returns>

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function RetrieveCustomSettingValue(settings, name) {
	/// <summary>
	/// Retrieves requested custom plugin setting value 
	/// </summary>
	/// <param name="settings">Available settings</param>
	/// <param name="name">Name of custom setting to retrieve</param>
	/// <returns type="">
	/// Return Value of requested plugin custom setting if available; otherwise returns DefaultValue
	/// </returns>

	for (var index = 0; index < settings.length; index++) {
		if (settings[index].Name == name) {
			if (settings[index].Value !== undefined) {
				return settings[index].Value;
			} else {
				return settings[index].DefaultValue;
			}
		}
	}
};

function _gim(name) {
	/// <summary>
	/// Gets locale message
	/// </summary>
	/// <param name="name">Name of message</param>
	/// <returns type="">Message for current borwser locale</returns>

	return chrome.i18n.getMessage(name) || name;
}

function _combinedgim() {
	/// <summary>
	/// Combines given arguments and returns locale message for combination
	/// </summary>

	var combined = "";
	for (var index = 0, cache = arguments.length - 1; index < cache; index++) {
		combined += arguments[index] + '_';
	}
	combined += arguments[index];

	return _gim(combined);
}

function _localize(object, dataAttribute) {
	/// <summary>
	/// Localizes given object's children if possible
	/// </summary>
	/// <param name="object">Object to localize</param>
	/// <param name="dataAttribute">Optional Look for custom data element atribute</param>

	var jObj = $(object);
	var attribute = dataAttribute || "locale";
	var localizable = $("[data-" + attribute + "]", jObj);
	for (var index = 0, cache = localizable.length; index < cache; index++) {
		var current = $(localizable[index]);
		current.text(_gim(current.data(attribute)));
	}
}

function _timed(func) {
	/// <summary>
	/// Timer for function
	/// </summary>
	/// <param name="func">Function on which to run timer</param>
	/// <returns type="">Time needed for function to execute</returns>

	var startTime = (new Date()).getTime();
	(func || function() {})();
	var endTime = (new Date()).getTime();
	return endTime - startTime;
}

function CreateTravianSidebar(header, content)
{
	html = '';
	html += '<div id="" class="sidebarBox">\
		<div class="sidebarBoxBaseBox">\
			<div class="baseBox baseBoxTop">\
				<div class="baseBox baseBoxBottom">\
					<div class="baseBox baseBoxCenter"></div>\
				</div>\
			</div>\
		</div>\
		<div class="sidebarBoxInnerBox">\
			<div class="innerBox header">\
				<button type="button" id="" class="layoutButton overviewWhite green" onclick="return false;">\
				</button>\
				<div class="clear"></div>\
				<div class="boxTitle">' + header + '</div>\
			</div>\
			<div class="innerBox content">\
				<div class="linklistNotice">' + content + '</div>\
			</div>\
			<div class="innerBox footer">\
			</div>\
		</div>\
	</div>';

	return $('#sidebarBoxLinklist').after(html);
}

function URLContains(text) {
	return document.URL.indexOf(text) != -1;
}