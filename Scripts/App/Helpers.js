/*
 * Helpers.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 */

var Helpers = {
	"Error": 	Error,
	"Warn": 	Warn,
	"Log": 		Log,
	"DLog":  	DLog
};


// TODO: Comment function
function Error(message) {
	if (IsDevelopmentMode) {
		console.error(message);
	}
}

// TODO: Comment function
function Warn(message) {
	if (IsDevelopmentMode) {
		console.warn(message);
	}
}

// TODO: Comment function
function Log(message) {
	if (IsDevelopmentMode) {
		console.log(message);
	}	
}

// TODO: Comment function
function DLog(message) {
	if (IsDebugMode == true && IsDevelopmentMode == true) {
		console.log("DEBUG:    " + message);
	}
}