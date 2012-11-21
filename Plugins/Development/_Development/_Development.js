/******************************************************************************
 * _Development.js
 * 
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		08.07.2012.
 *
 *****************************************************************************/

function Development() {
	/// <summary>
	/// Initializes object 
	/// </summary>
	this.Register = function () {
		Log("Development: Registering Development plugin...");
	};
}

// Metadata for this plugin (Development)
var DevelopmentMetadata = {
	Name: "_Development",
	Alias: "_Development",
	Category: "Economy",
	Version: "0.0.0.1",
	Description: "Development plugin is used to test new functionality and shouldn't be used as standard plugin",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Flags: {
		Internal: true
	},

	Class: Development
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, DevelopmentMetadata);