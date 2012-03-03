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
 		
 		var toolbar = GetNewToolbar(
 			GetNewLabel("Project - Axeman"),
 			GetNewButton("[BUTTON]", "#")
 			);

 		$("head").append(GetDevelopmentToolbarStyle());
 		$("body").append(toolbar);
 	}
 }

// TODO: Comment function
function GetDevelopmentToolbarStyle() {
	var style;

	var style =	'<style type="text/css">' +
					' .DTBase {' +
						'position:fixed;' +
						'bottom: 0px; right: 0px; left: 0px;' +
						'padding: 5px;' +
						'background: -webkit-gradient(linear, left top, left bottom, from(#D3D3D3), to(#919191));' +
					'}' +
					' .DTButton {' +
						'color: lightgray;' +
						'background: -webkit-gradient(linear, left top, left bottom, from(#747474), to(#4B4B4B));' +
						'padding: 2px 8px 2px 8px;' +
						'border-radius: 10px;' +
					'}' +
					' .DTLabel {' +
						'padding: 0px 10px;' +
						'color: black;' +
					'}' +
					' .DTInfo {' +
						'color: gray;' +
					'}' +
					' .DTWarn {' +
						'color: red;' +
					'}' +
				'</style>';

	return style;
}

// TODO: Comment function
function GetNewLabel(content) {
	return '<a class="DTLabel" href="#">' + content + '</a>';
}

// TODO: Comment function
function GetNewInfoLabel(content) {
	return '<a class="DTLabel DTInfo" href="#">' + content + '</a>';
}

// TODO: Comment function
function GetNewWarnLabel(content) {
	return '<a class="DTLabel DTWarn" href="#">' + content + '</a>';
}

// TODO: Comment function
function GetNewToolbar() {
	Helpers.DLog("Creating new toolbar with " + arguments.length + " components.");

	var toolbarSource = '<div class="DTBase" id="DevelopmentToolbar">';
	for (var index = 0; index < arguments.length; index++) {
		toolbarSource += arguments[index];
	}
	toolbarSource += '</dev>';

	return toolbarSource;
}

 // TODO: Comment function
 function GetNewButton(content, reference) {
 	return '<a class="DTButton" target="_blank" href="' + reference + '">' + content + '</a>&nbsp;&nbsp;&nbsp;&nbsp;'
 }