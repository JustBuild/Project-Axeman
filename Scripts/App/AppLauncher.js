/*
 * AppLauncher.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 */

var IsDevelopmentMode = true;

// Start message (log) that contains
// date and extension root URL
Helpers.Log("Extension initialized at ");
Helpers.Log((new Date()).toString());
Helpers.Log("Extension URL: " + chrome.extension.getURL("/") + "]");
Helpers.Log("Starting App...");


App.Start(IsDevelopmentMode);