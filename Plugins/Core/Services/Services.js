/******************************************************************************
 * Services.js
 * 
 * Author:
 * 		Aleksandar Toplek (AleksandarDev)
 *
 * Created on:
 * 		28.06.2012.
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

		Log("Services: Initializing...");

		// Call service methods
		GetIsLogedIn();
		ProcessProfiles();
		CrawlPage();
		UpdateProfile();
		// TODO Request refresh
	};

	var CrawlPage = function () {
		/// <summary>
		/// This function will crawl current page and get all available
		/// data from it and save it to current profile
		/// </summary>

		// Nothing to crawl is user is loged off
		if (!IsLogedIn) return;

		Log("Services: Crawling page...");

		// Call appropriate crawl functions
		if (MatchPages(Enums.TravianPages.VillageOut))
			CrawlVillageOut();
		else if (MatchPages(Enums.TravianPages.VillageIn))
			CrawlVillageIn();
		else Warn("Services: Page not implemented for crawling!");
	};

	var CrawlVillageOut = function () {
		/// <summary>
		/// Crawls for village out data
		/// </summary>

		Log("Services: Crawling VillageOut...");

		CrawlReports();
		CrawlMessages();
		CrawlVillageList();
		// CHEK WHAT THIS MEANS >>> // TODO VID  <<<
		// CANT DO THIS >>> // TODO Position <<<
		// DONE IN VILLAGE LIST >>> // TODO Name <<<
		CrawlLoyalty();
		CrawlProduction();
		CrawlStorage();
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

		Log("Services: Crawling VillageIn...");


	};

	var CrawlStorage = function () {
		/// <summary>
		/// Crawls for active village storages and crop production/consumption
		/// </summary>

		Log("Services: Crawling village storage...");

		var activeVillage = GetActiveVillage();

		$("#res > li > p > span").each(function (index, obj) {
			var resText = $(obj).text();
			var seperatorIndex = resText.indexOf("/");
			var resInStorage = parseInt(resText.substr(0, seperatorIndex));
			var storageMax = parseInt(resText.substr(seperatorIndex + 1, resText.length - seperatorIndex + 1));

			// If storage, else it's crop production/consumtion
			if (index < 4) {
				// Set Storage mac value
				if (index == 0) activeVillage.Resources.Storage[0] = storageMax;
				if (index == 3) activeVillage.Resources.Storage[1] = storageMax

				// Set current stored value
				activeVillage.Resources.Stored[index] = resInStorage;
			}
			else {
				activeVillage.Resources.TotalCropProduction = storageMax;
				activeVillage.Resources.Consumption = resInStorage;
			}
		});

		DLog("Services: Stored in Village [" + activeVillage.VID + "] is [" + activeVillage.Resources.Stored + "] and crop [" + activeVillage.Resources.Consumption + " of " + activeVillage.Resources.TotalCropProduction + "]");
		DLog("Services: Storage of Village [" + activeVillage.VID + "] is [" + activeVillage.Resources.Storage + "]");

		UpdateActiveVillage(activeVillage);
	};

	var CrawlProduction = function () {
		/// <summary>
		/// Crawls for active village production from production table (not from script)
		/// </summary>

		Log("Services: Crawling village production...");

		var activeVillage = GetActiveVillage();
		// Go through all table rows and parse production values to village resource production array
		$("#production > tbody > tr > .num").each(function (index, obj) {
			activeVillage.Resources.Production[index] = parseInt($(obj).text());
		});
		UpdateActiveVillage(activeVillage);

		DLog("Services: Production of Village [" + activeVillage.VID + "] is [" + activeVillage.Resources.Production + "]");
	};

	var CrawlLoyalty = function () {
		/// <summary>
		/// Crawls for active village loyalty
		/// </summary>

		Log("Services: Crawling village loyalty...");

		// Get loyalty span text
		var loyaltyText = $("#villageName .loyalty").text();

		// Get index of loyalty word end
		var index = loyaltyText.indexOf(":");

		// Remove loyalty word and percentage sign then parse to int
		var loyalty = parseInt(loyaltyText.substr(index + 1, loyaltyText.length - index + 1).replace("%", "")) || 0;

		// Set crawled data to active village
		var activeVillage = GetActiveVillage();
		activeVillage.Loyalty = loyalty;
		UpdateActiveVillage(activeVillage);

		DLog("Services: Set Village [" + activeVillage.VID + "] loyalty to [" + activeVillage.Loyalty + "]");
	};

	var CrawlVillageList = function () {
		/// <summary>
		/// Crawls Village list data
		/// </summary>

		Log("Services: Crawling Villages list...");

		// Go through all available entryes in village list
		$("#villageList .entry").each(function (index, obj) {
			// Gets basic village values
			var villageName = $(" > a", this).text();
			var villageID = parseInt($(" > a", this).attr("href").replace("?newdid=", "")) || 0;
			var isVillageActive = $(this).is(".active");

			DLog("Services: Found village \"" + villageName + "\" [" + villageID + "]");

			// Try to update village data
			// TODO optimize > exit loop on village found
			var wasUpdated = false;
			$.each(ActiveProfile.Villages, function (index, obj) {
				// Check if this is matched village
				if (obj.VID == villageID) {
					wasUpdated = true;

					obj.IsActive = isVillageActive;
					obj.Name = villageName;
					obj.VID = villageID;

					// Check if this is active village
					if (obj.IsActive) {
						ActiveVillageIndex = index;
						DLog("Service: Set ActiveVilageIndex to [" + ActiveVillageIndex + "]");
					}

					DLog("Services: Village [" + villageID + "] updated...");
				}
			});

			// Create new village if didnt match any village
			if (!wasUpdated) {
				var newVillage = new Models.Village();
				newVillage.Name = villageName;
				newVillage.VID = villageID;
				newVillage.IsActive = isVillageActive;

				// Check if this is active village
				if (newVillage.IsActive) {
					ActiveVillageIndex = ActiveProfile.Villages.length;
					DLog("Service: Set ActiveVilageIndex to [" + ActiveVillageIndex + "]");
				}

				ActiveProfile.Villages[ActiveProfile.Villages.length] = newVillage;

				DLog("Services: New Village [" + villageID + "] registered!");
			}
		});
	};

	var CrawlMessages = function () {
		/// <summary>
		/// Crawls for new user reports
		/// </summary>

		var currentReportsCount = parseInt($(".messages .bubble-content").text()) || 0;

		// Check if on Messages page
		if (MatchPages(Enums.TravianPages.Messages)) {
			// TODO Implement
		}
		else {
			ActiveProfile.Messages.UnreadCount = currentReportsCount;
		}

		DLog("Services: CrawlReports found [" + currentReportsCount + "] new messages");
	};

	var CrawlReports = function () {
		/// <summary>
		/// Crawls for new user reports
		/// </summary>

		var currentReportsCount = parseInt($(".reports .bubble-content").text()) || 0;

		// Check if on Reports page
		if (MatchPages(Enums.TravianPages.Reports)) {
			// TODO Implement
		}
		else {
			ActiveProfile.Reports.UnreadCount = currentReportsCount;
		}

		DLog("Services: CrawlReports found [" + currentReportsCount + "] new reports");
	};

	var GetIsLogedIn = function () {
		/// <summary>
		/// Sets variable to true if user is loged in
		/// </summary>

		IsLogedIn = !IsNullOrEmpty($(".signLink"));

		if (IsLogedIn)
			Log("Services: User is loged in...");
		else Warn("Services: User isn't loged in!");
	};

	var ProcessProfiles = function () {
		/// <summary>
		/// Sets profile object to AvailableProfiles
		/// </summary>

		// Can't get active user if user isn't loged in
		if (!IsLogedIn) return;

		// Gets active profile UID
		var activeProfileUID = parseInt($(".signLink").attr("href").replace("spieler.php?uid=", ""));
		DLog("Services: Active profile UID is [" + activeProfileUID + "]");

		// Search for matching profile
		// TODO optimize > exit loop on profile found
		$.each(AvailableProfiles, function (index, obj) {
			// Match using User ID and Server Address
			if (obj.ServerAddress == ActiveServerAddress &&
				obj.UID == activeProfileUID) {
				// Set Active Profile
				Log("Services: Active profile is found!");
				ActiveProfile = obj;
			}
		});

		// Creates new profile if matching profile doesn't exist
		if (IsNullOrEmpty(ActiveProfile)) {
			Warn("Services: No profiles available that match this user!");
			Log("Services: Creating new profile...");

			ActiveProfile = new Models.Profile();
			ActiveProfile.ServerAddress = ActiveServerAddress;
			ActiveProfile.Name = $(".sideInfoPlayer span").text();
			ActiveProfile.UID = activeProfileUID;
			ActiveProfile.Tribe = Enums.Tribes[$(".sideInfoPlayer img").attr("class").replace("nationBig nationBig", "")];

			DLog("Services: New profile created \"" + ActiveProfile.Name + "\" [" + ActiveProfile.UID + "] on server [" + ActiveProfile.ServerAddress + "]");
		}
	};

	var UpdateProfile = function (newProfile) {
		/// <summary>
		/// Updates AvailableProfiles list with new profile data
		/// </summary>
		/// <param name="newProfile">Profile data for update</param>

		Log("Services: Saving profile...");

		// Search for profile to update
		// TODO optimize > exit loop on profile found
		var wasUpdated = false;
		$.each(AvailableProfiles, function (index, obj) {
			// Check if current profile matched active profile
			if (obj.ServerAddress == ActiveProfile.ServerAddress &&
				obj.UID == ActiveProfile.UID) {
				// Replace old data with new data
				AvailableProfiles[index] = ActiveProfile;

				wasUpdated = true;
			}
		});

		// If no profile was updated, create new profile
		// Adds new profile to the end of list
		if (!wasUpdated) {
			AvailableProfiles[AvailableProfiles.length] = ActiveProfile;
		}

		// Sends request to save profiles list so that other plugins can use it
		var updateProfilesRequest = new Request("Background", "Data", "Profiles", "set", JSON.stringify(AvailableProfiles));
		updateProfilesRequest.Send(function (response) { });
	};

	var GetActiveVillage = function () {
		/// <summary>
		/// Gets currently active village
		/// </summary>
		/// <returns>Models.Village object representing currently active village</returns>

		return ActiveProfile.Villages[ActiveVillageIndex];
	};

	var UpdateActiveVillage = function (updatedVillage) {
		/// <summary>
		/// Updates active village
		/// </summary>
		/// <param name="updatedVillage">Update village</param>

		ActiveProfile.Villages[ActiveVillageIndex] = updatedVillage;
	};
}

// Metadata for this plugin (Services)
var ServicesMetadata = {
	Name: "Services",
	Alias: "Services",
	Category: "Core",
	Version: "0.0.1.1",
	Description: "Takes care of all variables and randomly changes pages. This is core plugin and by disableing it you could do damage to saved user data.",
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