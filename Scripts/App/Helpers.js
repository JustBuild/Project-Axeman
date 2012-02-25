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
	"Log": Log
};


function Log(message) {
	if (IsDevelopmentMode) {
		console.log(message);
	}	
}