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
  /// <summary>
  /// Initializes object
  /// </summary>
  this.Register = function(settings) {
    var refreshRate = RetrieveCustomSettingValue(settings, "RefreshRate");

    this.Initialize(refreshRate);
  };

  this.Initialize = function(refreshRate) {
    Log("Initializing AutoRefresher plugin", "AutoRefresher");

    CreateTravianSidebar(
      "Auto Refresher",
      'Reloading the page in: <span id="PA-refresh-interval" />'
    );

    // ((Math.random() + 0.5) * 1000
    // Result is: 500 .. 1500
    var refreshSeconds = Math.round(
      refreshRate * ((Math.random() + 0.5) * 1000) / 1000
    );

    var interval = setInterval(function() {
      $("#PA-refresh-interval").text(refreshSeconds);
      refreshSeconds--;

      if (refreshSeconds < 0) {
        Log("Refreshing page!", "AutoRefresher");
        location.reload();
        clearInterval(interval);
      }
    }, 1000);

    Log("Refresh in (ms)" + refreshSeconds);
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
  Site: "https://github.com/bungiman/Project-Axeman",

  Settings: {
    IsLoginRequired: true
  },

  CustomSettings: [
    {
      Name: "RefreshRate",
      Header: "How often to refresh (seconds)",
      DataType: Enums.DataTypes.Number,
      DefaultValue: "180"
    }
  ],

  Flags: {
    Alpha: true,
    Internal: true
  },

  Class: AutoRefresher
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(
  true,
  {},
  Models.PluginMetadata,
  AutoRefresherMetadata
);
