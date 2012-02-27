/*
 * DevelopmentToolbar.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		27.02.2012.
 *
 */

// Here goese public function definitions
 var DevelopmentToolbar = {
 	"Register": 		Register
 }


/*
 * Registers Developer toolbar plugin
 */
 function Register() {
 	Helpers.Log("Registering DevelopmentToolbar plugin...");

 	if (IsDevelopmentMode == false) {
 		Helpers.DLog("Plugin set to inactive due to extension not in development mode.");
 	}
 	else {
 		Helpers.DLog("Extension is in development mode - plugin set to active.");
 		
 		// TODO: Implement registration here
 	}
 }