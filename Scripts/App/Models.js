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
 * Village model
 *
 *****************************************************************************/
Models.Village = function () {
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

		TotalCropProduction: 0,
		Consumption: 0
	};

	// Note: On dorf1.php page
	this.VillageIn = {
		LastUpdated: 0,

		Levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		Buildings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
Models.Profile = function () {
	this.ServerAddress = "unknown";

	this.Name = "unknown";
	this.UID = "unknown";
	this.Tribe = "unknown";

	this.Population = "unknown";
	this.Villages = new Array();

	this.Messages = new Models.MessagesCollection();
	this.Reports = new Models.ReportsCollection();
};

Models.MessagesCollection = function () {
	this.UnreadCount = 0;

	this.Unread = new Array();
};

Models.Message = function () {
	this.IsRead = false;
	this.MID = "unknown";
	this.Subject = "unknown";
	this.From = "unknown";
	//this.FromUID = 0;
	this.Date = "unknown";
};

Models.ReportsCollection = function () {
	this.UnreadCount = 0;

	this.Unread = new Array();
};

Models.Report = function () {
	this.IsRead = false;
	this.RID = "unknown";
	this.Type = "unknown";
	this.FromX = 0;
	this.FromY = 0;
	this.ToX = 0;
	this.Toy = 0;
	this.Date = "unknown";
};

Models.PluginMetadata = {
	Name: "",
	Alias: "",
	Category: "",
	Version: "",
	Description: "",
	Author: "",
	Site: "",

	Settings: {
		HasSettings: false,
		SourceURL: "",
		Changeable: true
	},
	
	Default: {
		State: "On"
	},

	Flags: {
			Internal: false,
			Alpha: false,
			Beta: false,
			Featured: false
	},

	Class: ""
};