/******************************************************************************
 * TravianPLUS.js
 *
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		13.01.2013.
 *
 *****************************************************************************/

function TravianPLUS() {
  /// <summary>
  /// Initializes object
  /// </summary>
  this.Register = function() {
    Log("Registering TravianPLUS plugin...", "TravianPLUS");

    // [WIP] Waiting loop
    // Larger map
    // Archive reports and messages
    // Sorting function for marketplace
    // Auto-completion
    // Direct-links
    // Statistics
    // Account overview
    // Notepad
    // Crop finder

    // Reports/Messages 'Check all' option
    ReportsShowCheckAll();
  };

  var ReportsShowCheckAll = function() {
    /// <summary>
    /// Adds checkbox on the end of reports list to check all reports
    /// </summary>

    Log("Adding 'Check all' option to reports and messages", "TravianPLUS");

    if (!$("#markAll").length && !$(".checkAll").length) {
      var sourceScript =
        "$(this).up('form').getElements('input[type=checkbox]').each(function(element){element.checked = this.checked;}, this);";
      var sourceCode =
        "<div id='markAll' style='margin-left: 7px; float: left;'><input class='check' type='checkbox' id='sAll'><span style='margin-left: 8px;'><label for='sAll'>Select all</label></span></div>";

      var obj = $(sourceCode);
      obj.children("input").attr("onClick", sourceScript);

      $(".paginator").before(obj);

      DLog("CheckBox appended", "TravianPLUS");
    } else
      DLog("CheckBox already exists (user uses PLUS account)", "TravianPLUS");

    Log("Adding 'Check all' option successfully added", "TravianPLUS");
  };
}

// Metadata for this plugin (TravianPLUS)
var TravianPLUSMetadata = {
  Name: "TravianPLUS",
  Alias: "Travian PLUS",
  Category: "Utility",
  Version: "0.0.0.1",
  Description: "TODO",
  Author: "JustBuild Development",
  Site: "https://github.com/JustBuild/Project-Axeman/wiki",

  Settings: {
    IsLoginRequired: true,
    RunOnPages: [Enums.TravianPages.Reports, Enums.TravianPages.Messages],
    PageMayContain: [
      ".reports .container.active a:not([href*='t=5'])",
      ".messages .container.active a:not([href*='t=1'])"
    ]
  },

  Flags: {
    Alpha: true,
    Internal: true
  },

  Class: TravianPLUS
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(
  true,
  {},
  Models.PluginMetadata,
  TravianPLUSMetadata
);
