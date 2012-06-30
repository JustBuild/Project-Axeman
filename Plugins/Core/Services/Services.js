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

	this.Register = function () {
		/// <summary>
		/// Registers plugin 
		/// </summary>

		Helpers.Log("Services: Initializing...");

		// Call service methods
		GetActiveProfile();
		CrawlPage();
	};

	var CrawlPage = function () {
		/// <summary>
		/// This function will crawl current page and get all available
		/// data from it and save it to current profile
		/// </summary>

		Helpers.Log("Services: Crawling page...");

		if (Helpers.MatchPages(Enums.TravianPages.VillageOut))
			CrawlVillageOut();
		else if (Helpers.MatchPages(Enums.TravianPages.VillageIn))
			CrawlVillageIn();
		else Helpers.Warn("Services: Page not implemented for crawling!");
	};

	var CrawlVillageOut = function () {
		/// <summary>
		/// Crawls for village out data
		/// </summary>

		Helpers.Log("Services: Crawling VillageOut...");
		// Check if user is loged in
		if (!Helpers.IsLogedIn()) { Helpers.Error("Services: User is loged out..."); return; }

		// TODO Reports
		CrawlReports();
		// TODO Messages
		// TODO Village list
		// TODO VID
		// TODO Position
		// TODO Name
		// TODO Loyalty
		// TODO Production
		// TODO Storage
		// TODO Village type
		// TODO Fields
		// TODO Tasks
		// TODO Military Units
		// TODO Movements
	};

	var CrawlVillageIn = function () {
		/// <summary>
		/// Crawls for village in data
		/// </summary>

		Helpers.Log("Services: Crawling VillageIn...");
		// Check if user is loged in
		if (!Helpers.IsLogedIn()) { Helpers.Error("Services: User is loged out..."); return; }


	};

	var CrawlReports = function () {
		var previousReportsCount = ActiveProfile.Reports.length || 0;
		var currentReportsCount = parseInt($(".reports .bubble-content").text()) || 0;
		var reportsDelta = currentReportsCount - previousReportsCount;

		

		Helpers.DLog("Services: CrawlReports found [" + reportsDelta + "] new reports");
	};

	var GetActiveProfile = function () {
		/// <summary>
		/// Sets profile object to AvailableProfiles
		/// </summary>
		/// <returns>Returns true if active profile is found</returns>

		// Gets active profile UID
		var activeProfileUID = parseInt($(".signLink").attr("href").replace("spieler.php?uid=", ""));
		Helpers.DLog("Services: Active profile UID is [" + activeProfileUID + "]");

		$.each(AvailableProfiles, function (index, obj) {
			if (obj.ServerAddress == ActiveServerAddress &&
				obj.UID == activeProfileUID) {
				Helpers.Log("Services: Active profile is found!");
				ActiveProfile = obj;
				return true;
			}
		});

		if (!ActiveProfile) {
			Helpers.Error("Services: No profiles available that match this user!");
			return false;
		}
	};

	var UpdateProfile = function (newProfile) {
		// TODO Implement
	};
}

// Metadata for this plugin (Services)
var ServicesMetadata = {
	Name: "Services",
	Alias: "Services",
	Category: "Core",
	Version: "0.0.1.1",
	Description: "Takes care of all variables and randomly changes pages. If you disable this plugin, other plugins may have strange behaviour.",
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