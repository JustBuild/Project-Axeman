/******************************************************************************
 * Variables.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		27.02.2012.
 *
 *****************************************************************************/

// Extensions
var Settings = new Models.OptionsModel();

// Development and debuging variables
var IsDevelopmentMode = function() {
  if (!Settings) return false;
  return Settings.IsDevelopmentModeEnabled;
};
var IsLogging = function() {
  if (!Settings) return false;
  return Settings.IsLoggingEnabled;
};

// Active page variables
var ActiveServerAddress = "travian.com";
var ActivePage = "/";
var ActivePageQuery = "";
var ActivePageTravianVersion = "unsuported";

// Current profile
var IsLogedIn = false;
var AvailableProfiles = new Array();
var ActiveProfile = function() {};
var ActiveVillageIndex = 0;

function isDevMode() {
  if (IsDevelopmentMode == null) {
    var mUrl = chrome.runtime.getURL("manifest.json");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", mUrl, false);
    xhr.onload = function() {
      var json = JSON.parse(this.responseText);
      IsDevelopmentMode = !("update_url" in json);
    };
    xhr.send();
  }

  return IsDevelopmentMode;
}
