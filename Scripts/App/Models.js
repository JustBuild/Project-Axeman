/******************************************************************************
 * Models.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		25.02.2012.
 *
 *****************************************************************************/

var Models = {};

/******************************************************************************
 *
 * Options model
 *
 *****************************************************************************/
Models.OptionsModel = function() {
  // Settings
  this.IsAdancedShown = false;
  this.IsExtensionEnabled = true;
  this.IsLoggingEnabled = false;
  this.IsDevelopmentModeEnabled = false;

  this.ToggleIsAdvancedShown = function() {
    this.IsAdancedShown(!this.IsAdancedShown());
  };

  this.ToggleIsOptionsShown = function(plugin, event) {
    plugin.IsOptionsShown(!plugin.IsOptionsShown());
  };

  // Plugins
  this.Plugins = new Array();
};

/******************************************************************************
 *
 * Plugin metadata model
 *
 *****************************************************************************/
Models.PluginMetadata = {
  Name: "",
  Alias: "",
  Category: "Other",
  Version: "0.0.1",
  Description: "TODO",
  Author: "",
  Site: "",
  State: false,

  Settings: {
    IsChangeable: true,
    IsLoginRequired: false,
    RunOnPages: [],
    RunOnPageQuery: {},
    PageMustContain: [],
    PageMayContain: []
  },

  CustomSettings: [],

  Default: {
    State: true
  },

  Flags: {
    Internal: false,
    Alpha: false,
    Beta: false,
    Featured: false
  },

  Class: ""
};

Models.PluginCustomSetting = {
  Name: "",
  Header: "",
  Description: "",
  DataType: undefined,
  Value: undefined,
  DefaultValue: undefined,
  Link: ""
};

/******************************************************************************
 *
 * Village model
 *
 *****************************************************************************/
Models.Village = function() {
  this.IsActive = false;

  // Note: On any *.travian.*/... page (except help)
  this.VID = 0;
  this.Name = "<NameNotDefined>";
  this.Loyalty = 100;

  // Note: On spieler.php?uid=* page where * is players id
  this.IsMainCity = false;
  this.Population = 0;
  this.Position = {
    x: 0,
    y: 0
  };

  // Note: On any *.travian.*/... page (except help)
  this.Resources = {
    Storage: [0, 0, 0, 0],
    Stored: [0, 0, 0, 0],

    Production: [0, 0, 0, 0],

    FreeCrop: 0
  };

  // Note: On dorf1.php page
  this.VillageIn = {
    LastUpdated: 0,

    Levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Buildings: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  };

  // NOTE: On dorf1.php page
  this.VillageOut = {
    LastUpdated: 0,

    Type: "f3",
    Levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  this.Troops = {
    // NOTE: On build.php?id=39 (since rally point is on the same place in every village)
    //       EXCEPT WW village
    // This is players troops currently in village that can be sent to attack/support
    AvailableTroops: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    // NOTE: On build.php?id=39 (since rally point is on the same place in every village)
    // This is total troops in village (supports + players troops + troops in attack/support/return/adventure)
    TotalTroops: {
      Gauls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Romans: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Teutons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Nature: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },

    // NOTE: build.php page > gid13 (Armory)
    TroopLevels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
};

/******************************************************************************
 *
 * Profile model
 *
 *****************************************************************************/
Models.Profile = function() {
  // Project-Axeman variables
  this.IsAutoLogin = false;
  this.Password = "";

  //Game variables
  this.ServerAddress = "unknown";
  this.ServerVersion = "unsuported";

  this.Name = "unknown";
  this.UID = "unknown";
  this.Tribe = "unknown";

  this.Villages = new Array();

  this.Messages = new Models.MessagesCollection();
  this.Reports = new Models.ReportsCollection();
  this.Hero = new Models.Hero();

  //this.Plugins = new Array();
};

Models.MessagesCollection = function() {
  this.UnreadCount = 0;

  this.Inbox = {};
  this.Sent = {};
  this.Draft = new Array();
  this.Archive = {};
};

Models.Message = function() {
  this.IsRead = false;
  this.MID = "unknown";
  this.Subject = "unknown";
  this.From = "unknown";
  this.FromUID = 0;
  this.Date = "unknown";
  this.Content = "";
};

Models.ReportsCollection = function() {
  this.UnreadCount = 0;

  this.Unread = new Array();
};

Models.Report = function() {
  this.IsRead = false;
  this.RID = "unknown";
  this.Type = "unknown";
  this.FromX = 0;
  this.FromY = 0;
  this.ToX = 0;
  this.Toy = 0;
  this.Date = "unknown";
};

Models.Hero = function() {
  this.HasAdventure = false;
  this.CanAdventure = false;
};

// TODO Implement into PluginsManager
//Models.ProfilePlugin = function () {
//	this.IsActive = true;
//	this.Settings = {};
//};
