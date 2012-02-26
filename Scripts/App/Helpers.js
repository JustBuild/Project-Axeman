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
	"Log": 		Log
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