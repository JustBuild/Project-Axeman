/************************************************
 * DevelopmentToolbar.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		27.02.2012.
 *
 ***********************************************/

/************************************************
 *
 * Development toolbar that appears on bottom
 * of the page
 *
 ***********************************************/
function DevelopmentToolbar() {
	/********************************************
	 *
	 * Registers Developer toolbar plugin
	 *
	 *******************************************/
	this.Register = function() {
		Helpers.Log("Registering DevelopmentToolbar plugin...");

		if (IsDevelopmentMode == false) {
			Helpers.DLog("Plugin set to inactive due to extension not in development mode.");
		}
		else {
			Helpers.DLog("Extension is in development mode - plugin set to active.");

			var toolbar = this.GetNewToolbar(
 				this.GetNewLabel("Project - Axeman"),
 				this.GetNewButton("[BUTTON]", "#")
 			);

			$("head").append(this.GetDevelopmentToolbarStyle());
			$("body").append(toolbar);
		}
	}

	// TODO: Comment function
	this.GetDevelopmentToolbarStyle = function() {
		var style = '<style type="text/css">' +
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
	this.GetNewLabel = function(content) {
		return '<a class="DTLabel" href="#">' + content + '</a>';
	}

	// TODO: Comment function
	this.GetNewInfoLabel = function(content) {
		return '<a class="DTLabel DTInfo" href="#">' + content + '</a>';
	}

	// TODO: Comment function
	this.GetNewWarnLabel = function(content) {
		return '<a class="DTLabel DTWarn" href="#">' + content + '</a>';
	}

	// TODO: Comment function
	this.GetNewToolbar = function() {
		Helpers.DLog("Creating new toolbar with " + arguments.length + " components.");

		var toolbarSource = '<div class="DTBase" id="DevelopmentToolbar">';
		for (var index = 0; index < arguments.length; index++) {
			toolbarSource += arguments[index];
		}
		toolbarSource += '</dev>';

		return toolbarSource;
	}

	// TODO: Comment function
	this.GetNewButton = function(content, reference) {
		return '<a class="DTButton" target="_blank" href="' + reference + '">' + content + '</a>&nbsp;&nbsp;&nbsp;&nbsp;'
	}
}