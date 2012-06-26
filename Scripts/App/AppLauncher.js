/******************************************************************************
 * AppLauncher.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 *****************************************************************************/

// DO NOT USE ANY EXTENSION SCRIPT CLASSES (except App class)
// OR CREATE ANY VARIABLES IN THIS SCRIPT . THIS IS LAUNCHER!

// Start message (log) that contains
// date and extension root URL
console.log("Project Axeman Extension initialized at ");
console.log((new Date()).toString());
console.log("Extension URL [" + chrome.extension.getURL("/") + "]");
console.log("Starting App...");

// Create new App object and initialize
var app = new App()
app.Initialize();

console.log("App started!");