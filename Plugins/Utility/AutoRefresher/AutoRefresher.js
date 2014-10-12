/******************************************************************************
 * AutoRefresher.js
 *
 * Author:
 *      Ben Perry
 *
 * Created on:
 *      October 12, 2014
 *
 *****************************************************************************/

function AutoRefresher() {

    var refreshTime = 3; // minutes

    /// <summary>
    /// Initializes object
    /// </summary>
    this.Register = function() {
        this.initialize();
    };

    this.initialize = function() {
        Log("Initializing AutoRefresher plugin", "AutoRefresher");
        setTimeout(function() {
            Log("Refreshing page!", "AutoRefresher");
            location.reload();
        }, refreshTime*60*1000);
    };
}

// Metadata for this plugin (AutoRefresher)
var AutoRefresherMetadata = {
    Name: "AutoRefresher",
    Alias: "Auto Refresher",
    Category: "Utility",
    Version: "0.0.0.1",
    Description: "Auto Refreshes your game periodically",
    Author: "Ben Perry",
    Site: "https://github.com/JustBuild/Project-Axeman/wiki",

    Settings: {
        IsLoginRequired: true,
    },

    Flags: {
        Internal: true
    },

    Class: AutoRefresher
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, AutoRefresherMetadata);

