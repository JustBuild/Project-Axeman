/******************************************************************************
 * DevelopmentToolbar.js
 * 
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		27.02.2012.
 *
 * Notes:
 *			This plugin will enable developers to access frequently accessed
 *		development pages and give them aditional information about extension
 *		state. 
 *			This plugin will only be active when extension app is in 
 *		development mode which means that IsDevelopmentMode is set to true.
 *		This can be done by changing variable at Variables.js file.
 *
 *****************************************************************************/

/******************************************************************************
 *
 * Development toolbar that appears on bottom of the page
 *
 *****************************************************************************/
function DevelopmentToolbar() {
	/**************************************************************************
	 *
	 * Plugin header
	 *
	 *************************************************************************/
	this.PAli = "DevelopmentToolbar";
	this.PCat = "Development";
	this.PImg = "DevelopmentToolbar.png";
	this.PNam = "Development Toolbar";
	this.PVer = "0.0.2.1";
	this.PDes = "You can quickly access extension development pages from bottom of the page. It will even give you some additional information about script";
	this.PAut = "JustBuild Development";
	this.PMIS = "https://github.com/JustBuild/Project-Axeman";
	this.PFea = false;
	this.PBet = true;

	/**************************************************************************
	 *
	 * Registers Developer toolbar plugin
	 *
	 *************************************************************************/
	this.Register = function () {
		Helpers.Log("DevelopmentToolbar: Registering DevelopmentToolbar plugin...");

		// Check if plugin needs to be activated
		if (IsDevelopmentMode == false) {
			var developmentModeRequest = new Request("Background", "Data", "IsDevelopmentMode", "set", "true");
			developmentModeRequest.Send(null);
		}

		// Activate plugin message
		Helpers.Log("DevelopmentToolbar: Extension is in development mode - plugin set to active.");

		// Creates new development toolbar source code
		var toolbar = this.GetNewToolbar(
 			this.GetNewLabel("Project - Axeman"),
 			this.GetNewButton("PluginManager", Helpers.GetExtensionRootURL("/Pages/PluginsManager.html")),
			this.GetNewButton("Popup", Helpers.GetExtensionRootURL("/Pages/Popup.html")),
			this.GetNewButton("StorageDetails", Helpers.GetExtensionRootURL("/Pages/StorageDetails.html"))
 		);

		// Appends style and code to current page
		$("head").append(this.GetDevelopmentToolbarStyle());
		$("body").append(toolbar);
	};

	// TODO: Comment function
	this.GetDevelopmentToolbarStyle = function () {
		var style =
			'<style type="text/css">' +
				// Toolbar style
				'.DTBase {' +
					'position:fixed;' +
					'bottom: 0px; right: 0px; left: 0px;' +
					'padding: 5px;' +
					'background: -webkit-gradient(linear, left top, left bottom, from(#D3D3D3), to(#919191));' +
				'}' +
				// Button style
				'.DTButton:link, ' +
				'.DTButton:hover, ' +
				'.DTButton:visited, ' +
				'.DTButton:active, ' +
				'.DTButton {' +
					'color: lightgray;' +
					'background: -webkit-gradient(linear, left top, left bottom, from(#747474), to(#4B4B4B));' +
					'padding: 2px 8px 2px 8px;' +
					'border-radius: 10px;' +
				'}' +
				// Label style
				'.DTLabelNormal:link, ' +
				'.DTLabelNormal:hover, ' +
				'.DTLabelNormal:visited, ' +
				'.DTLabelNormal:active, ' +
				'.DTLabelNormal {' +
					'padding: 0px 10px;' +
					'color: black;' +
				'}' +
				// InfoLabel style
				'.DTLabelInfo:link, ' +
				'.DTLabelInfo:hover, ' +
				'.DTLabelInfo:visited, ' +
				'.DTLabelInfo:active, ' +
				'.DTLabelInfo {' +
					'color: gray;' +
				'}' +
				// WarnLabel style
				'.DTLabelWarn:link, ' +
				'.DTLabelWarn:hover, ' +
				'.DTLabelWarn:visited, ' +
				'.DTLabelWarn:active, ' +
				'.DTLabelWarn {' +
					'color: red;' +
				'}' +
			'</style>';

		return style;
	};

	// TODO: Comment function
	this.GetNewLabel = function (content) {
		Helpers.DLog("DevelopmentToolbar: Creating new label '" + content + "'");

		return '<a class="DTLabelNormal" href="#">' + content + '</a>';
	};

	// TODO: Comment function
	this.GetNewLabelInfo = function (content) {
		Helpers.DLog("DevelopmentToolbar: Creating new InfoLabel '" + content + "'");

		return '<a class="DTLabelNormal DTLabelInfo" href="#">' + content + '</a>';
	};

	// TODO: Comment function
	this.GetNewLabelWarn = function (content) {
		Helpers.DLog("DevelopmentToolbar: Creating new WarnLabel '" + content + "'");

		return '<a class="DTLabelNormal DTLabelWarn" href="#">' + content + '</a>';
	};

	// TODO: Comment function
	this.GetNewToolbar = function () {
		Helpers.DLog("DevelopmentToolbar: Creating new Toolbar with [" + arguments.length + "] components.");

		var toolbarSource = '<div class="DTBase" id="DevelopmentToolbar">';
		for (var index = 0; index < arguments.length; index++) {
			toolbarSource += arguments[index];
		}
		toolbarSource += '</dev>';

		return toolbarSource;
	};

	// TODO: Comment function
	this.GetNewButton = function (content, reference) {
		Helpers.DLog("DevelopmentToolbar: Creating new Button of content '" + content + "'");

		return '<a class="DTButton" target="_blank" href="' + reference + '">' + content + '</a>&nbsp;&nbsp;&nbsp;&nbsp;'
	};
}