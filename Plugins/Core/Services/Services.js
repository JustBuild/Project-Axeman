/******************************************************************************
 * Services.js
 * 
 * Author:
 * 		Aleksandar Toplek (AleksandarDev)
 *
 * Created on:
 * 		<28.06.2012.>
 *
 * Notes:
 *		TODO 
 *
 *****************************************************************************/

function Services() {
	/// <summary>
	/// Plugin that takes care of all built-in models (fill and update), refreshes page and changes views randomly.
	/// </summary>

	this.Register = function() {
		/// <summary>
		/// Registers plugin 
		/// </summary>
	}
}

// Metadata for this plugin (Services)
var ServicesMetadata = {
	Name: "Services",
	Alias: "Services",
	Category: "Core",
	Version: "0.1.0.1",
	Description: "Takes care of all variables and randomly changes pages.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		HasSettings: false,
		SourceURL: ""
	},

	Flags: {
		Internal: false,
		Alpha: true,
		Beta: false,
		Featured: false
	},

	Class: Services
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = ServicesMetadata;