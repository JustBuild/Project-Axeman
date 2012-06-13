﻿/******************************************************************************
 * PluginsManager.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		07.06.2012.
 *
 *****************************************************************************/

function PluginsManager() {
	// List of available plugins
	this.availablePlugins = [
		DevelopmentToolbar,
		Feedback
	];


	// TODO comment
	this.Initialize = function () {
		Helpers.Log("PluginsManager: Initializing...");

		this.RegisterPlugins(this.availablePlugins);
	}


	/**************************************************************************
	 *
	 * Registers all available plugins from
	 * the list passed
	 *
	 *************************************************************************/
	this.RegisterPlugins = function (pluginsToRegister) {
		Helpers.DLog("App: Registering [" + pluginsToRegister.length + "] plugins");
		for (var index in pluginsToRegister) {
			var plugin = new pluginsToRegister[index]();
			RegisterPlugin(plugin);	
		}
	};

	var RegisterPlugin = function (plugin) {
		var activeStateRequest = new Request("Background", "Data", "PActive" + plugin.PAli, "get", null);
		var isLoaded = false;
		activeStateRequest.Send(function (response) {
			if (response == "On") {
				Helpers.Log("PluginsManager: Plugin '" + plugin.PAli + "' is active... Registering");
				plugin.Register();
			}
			else Helpers.Log("PluginsManager: Plugin '" + plugin.PAli + "' is NOT active!");

			var isLoaded = true;
		});
	};
}
