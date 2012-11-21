/******************************************************************************
 * PluginsManager.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		07.06.2012.
 *
 *****************************************************************************/

// Global list of available plugins this list is used for registering 
// all plugins so that developer doesn't have to write script path to
// a lot of places (Only in manifest.json and Development notes.txt)
//
// ADD METADATA TO THIS LIST, DO NOT ADD PLUGIN CLASS
//
var GlobalPluginsList = new Array();

function PluginsManager() {
	// TODO comment
	this.Initialize = function () {
		Log("PluginsManager: Initializing...");

		this.RegisterPlugins(GlobalPluginsList);
	}


	/**************************************************************************
	 *
	 * Registers all available plugins from
	 * the list passed
	 *
	 *************************************************************************/
	this.RegisterPlugins = function (pluginsToRegister) {
		DLog("PluginsManager: Registering [" + pluginsToRegister.length + "] plugins");

		$.each(pluginsToRegister, function (index, obj) {
			// If plugins is internal don't load it if development mode is off
			if (obj.Flags.Internal && !IsDevelopmentMode) {
				DLog("PluginsManager: Internal plugin [" + obj.Name  + "]");
				return;
			}

			RegisterPlugin(obj);
		});
	};

	var RegisterPlugin = function (pluginMetadata) {
		var activeStateRequest = new Request("Background", "Data", "IsPluginActive" + pluginMetadata.Name, { Type: "get" });

		// Send request and handle callback
		activeStateRequest.Send(
			function (response) {
				if (response == null || !response.State || response.State == "On") {
					Log("PluginsManager: Plugin '" + pluginMetadata.Name + "' is active...");
					Log("PluginsManager: Registering '" + pluginMetadata.Name + "'");

					var pluginObject = new pluginMetadata.Class();
					pluginObject.Register();
				}
				else Log("PluginsManager: Plugin '" + pluginMetadata.Name + "' is NOT active!");
			}
		);
	};
}