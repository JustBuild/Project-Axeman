/******************************************************************************
 * Services.js
 *
 * Author:
 * 		Aleksandar Toplek (AleksandarDev)
 *
 * Created on:
 * 		28.06.2012.
 *
 *****************************************************************************/

function Services() {
	/// <summary>
	/// Plugin that takes care of all built-in models (fill and update), refreshes page and changes views randomly.
	/// </summary>

	//
	// Variables
	//
	var activeVillage;


	this.Register = function () {
		/// <summary>
		/// Registers plugin
		/// </summary>

		Log("Initializing...", "Services");

		// Check if user is loged in
		ProcessIsLogedIn();

		// Crawl for travian version
		CrawlVersion();

		// Process profile
		ProcessProfiles();

		// Crawl current page
		CrawlPage();

		// Save changes
		SaveActiveVillage();
		SaveProfileChanges();

		// Try to auto-login profile if possible
		AutoLoginUser();

		// Initiate refresh service
		InitializeNavigationService();
	};

	var InitializeNavigationService = function() {
		// TODO Implement
	};

	var AutoLoginUser = function () {
		/// <summary>
		/// If profile has option enabled and password is available, fills login information  and submits form
		/// </summary>

		Log("Checking if user can login automatically", "Services");

		if (!IsLogedIn && ActiveProfile.IsAutoLogin && ActiveProfile.Password) {
			$(".login input[name='name']").val(ActiveProfile.Name);
			$(".login input[name='password']").val(ActiveProfile.Password);

			$("form[name='login']").submit();
		}
	};

	var CrawlPage = function () {
		/// <summary>
		/// This function will crawl current page and get all available
		/// data from it and save it to current profile
		/// </summary>

		// Nothing to crawl is user is loged off
		if (!IsLogedIn) {
			DLog("Crawling not supported when user isn't loged in!", "Services");
			return;
		}

		if (!MatchPages([
			Enums.TravianPages.Home,
			Enums.TravianPages.Login,
			Enums.TravianPages.Logout])) {

			Log("Crawling page...", "Services");

			CrawlVillageList();
			activeVillage = ActiveProfile.Villages[ActiveVillageIndex];

			CrawlStorage();
			CrawlProduction();
			// TODO Port rest of crawlings
			CrawlLoyalty();
			CrawlMessages();
			CrawlReports();
            CrawlHero();

			if (MatchPages([Enums.TravianPages.Player]) && !URLContains('uid')) {

				Log("Crawling Player page...", "Services");

				CrawlVillagesDetails();
			}
			if (MatchPages([Enums.TravianPages.VillageOut])) {

				Log("Crawling Village Out page...", "Services");

				CrawlVillageType();
				CrawlVillageFields();
				CrawlVillageBuildTasks();
				CrawlVillageMovements();
				CrawlVillageTotalTroops();
			}
			if (MatchPages([Enums.TravianPages.VillageIn])) {

				Log("Crawling Village In page...", "Services");

				CrawlVillageBuildings();
				CrawlVillageBuildTasks();
			}
			// TODO Military Units
			// TODO Crawl movements from rally point
		}
	};

	var CrawlVersion = function () {
		/// <summary>
		/// Crawls for server version that is currently active
		/// </summary>

		if (!IsLogedIn) {
			DLog("Can't crawl for travian version when player isn't loged in", "Services");
			return;
		}

		if ($(".sideInfoPlayer .signLink").length) ActivePageTravianVersion = "4";
		else if ($("#sidebarBoxDailyquests").length) ActivePageTravianVersion = "4.4";
		else if ($(".sidebarBoxInnerBox .heroImage").length) ActivePageTravianVersion = "4.2";

		DLog("Travian version: " + ActivePageTravianVersion, "Services");
	};

	var CrawlStorage = function () {
		/// <summary>
		/// Crawls for active village storages and crop production/consumption
		/// Supported versions: 4, 4.2, 4.4
		/// </summary>

		Log("Crawling village storage...", "Services");

		if (ActivePageTravianVersion === "4") {
			$("#res > li > p > span").each(function(index, obj) {
				var resText = $(obj).text();
				var separated = resText.split("/");

				// If storage, else it's crop production/consumtion
				if (index < 4) {
					// Set Storage max value
					activeVillage.Resources.Storage[index] = parseInt(separated[1], 10) || 0;

					// Set current stored value
					activeVillage.Resources.Stored[index] = parseInt(separated[0], 10) || 0;
				} else {
					activeVillage.Resources.FreeCrop = parseInt(resText, 10) || 0;
				}
			});
		}
		else if (ActivePageTravianVersion === "4.2" || ActivePageTravianVersion === "4.4") {
			var warehouseSize = parseInt($("#stockBarWarehouse").text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;
			var granarySize = parseInt($("#stockBarGranary").text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;

			for (var index = 0; index < 4; index++) {
				activeVillage.Resources.Stored[index] = parseInt($("#l" + (index + 1)).text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;
				activeVillage.Resources.Storage[index] = index == 3 ? granarySize : warehouseSize;
			}

			// Crawl Free Crop
			activeVillage.Resources.FreeCrop = parseInt($("#stockBarFreeCrop").text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;
		} else throw ("Unsuported travian version");

		DLog("Stored in Village [" + activeVillage.VID + "] is [" + activeVillage.Resources.Stored + "] and free crop [" + activeVillage.Resources.FreeCrop + "]", "Services");
		DLog("Storage of Village [" + activeVillage.VID + "] is [" + activeVillage.Resources.Storage + "]", "Services");
	};

	var CrawlProduction = function () {
		/// <summary>
		/// Crawls for active village production from production table (not from script)
		/// Supported versions: 4, 4.2, 4.4
		/// </summary>

		Log("Crawling village production...", "Services");

		// Go through all script values and parse production values to village resource production array
		var scriptContent = $("script:contains('resources.production')").html();

		// Regular expression string from
		// http://txt2re.com/index-javascript.php3?s=resources.production%20=%20{%20%27l1%27:%20500,%27l2%27:%20556,%27l3%27:%20500,%27l4%27:%20367};&16&12&14&13&11
		var regexString = ".*?\\d+.*?(\\d+).*?\\d+.*?(\\d+).*?\\d+.*?(\\d+).*?\\d+.*?([-+]?\\d+)";
		var p = new RegExp(regexString, ["i"]);
		var m = p.exec(scriptContent);
		if (m != null) {
			for (var index = 1; index < 5; index++) {
				activeVillage.Resources.Production[index - 1] = parseInt(m[index], 10) || 0;
			};

			DLog("Production of Village [" + activeVillage.VID + "] is [" + activeVillage.Resources.Production + "]", "Services");
		}
		else Warn("Can't parse production script!", "Services");
	};

	var CrawlLoyalty = function () {
		/// <summary>
		/// Crawls for active village loyalty
		/// Supported versions: 4, 4.2, 4.4
		/// </summary>

		Log("Crawling village loyalty...", "Services");

		if (ActivePageTravianVersion === "4") {
			// Get loyalty span text
			var loyaltyText = $("#villageName .loyalty").text();

			// Remove 'Loyalty' word parse right part to number
			activeVillage.Loyalty = parseInt(loyaltyText.split(":")[1], 10) || 0;
		} else if (ActivePageTravianVersion === "4.2" || ActivePageTravianVersion === "4.4")
			activeVillage.Loyalty = parseInt($("#sidebarBoxActiveVillage div.loyalty.medium > span").text().replace(/[^\d]/g, ""), 10) || 0;
		else throw ("Unsuported travian version");

		DLog("Set Village [" + activeVillage.VID + "] loyalty to [" + activeVillage.Loyalty + "]", "Services");
	};

	var CrawlVillageList = function () {
		/// <summary>
		/// Crawls Village list data
		/// Supported versions: dependency
		/// </summary>

		Log("Crawling Villages list...", "Services");

		var villagesFomList = GetVillagesListData();
		for (var index = 0; index < villagesFomList.length; index++) {
			var village = villagesFomList[index];
			DLog("Found village \"" + village.name + "\" [" + village.id + "]", "Services");

			// Try to update village data
			var wasUpdated = false;
			for (var indexActive = 0, cache = ActiveProfile.Villages.length; indexActive < cache; indexActive++) {
				var obj = ActiveProfile.Villages[indexActive];

				// Check if this is matched village
				if (obj.VID == village.id) {
					wasUpdated = true;

					obj.IsActive = village.isActive;
					obj.Name = village.name;
					obj.VID = village.id;

					// Check if this is active village
					if (obj.IsActive) {
						ActiveVillageIndex = indexActive;
						DLog("Set ActiveVilageIndex to [" + ActiveVillageIndex + "]", "Services");
					}

					DLog("Village [" + village.id + "] updated...", "Services");
					break;
				}
			}

			// Create new village if didnt match any village
			if (!wasUpdated) {
				var newVillage = new Models.Village();
				newVillage.Name = village.name;
				newVillage.VID = village.id;
				newVillage.IsActive = village.isActive;

				// Check if this is active village
				if (newVillage.IsActive) {
					ActiveVillageIndex = ActiveProfile.Villages.length;
					DLog("Set ActiveVilageIndex to [" + ActiveVillageIndex + "]", "Services");
				}

				ActiveProfile.Villages[ActiveProfile.Villages.length] = newVillage;

				Log("New Village [" + village.id + "] registered!", "Services");
			}
		}

		// Shows message to crawn profile page
		var mainVillageFound = false;
		for (var index = 0; index < ActiveProfile.Villages.length; index++) {
			if (ActiveProfile.Villages[index].IsMainCity) {
				mainVillageFound = true;
				break;
			}
		}
		if (!mainVillageFound) {
			// TODO Localize
			$("#sidebarBoxVillagelist .innerBox.content").append("<br/><div>Capital village not detected. Visit your <a href='/spieler.php' style='color: #00BC00; text-decoration: underline;'>profile page</a>.</div>");
		}
	};

	var GetVillagesListData = function () {
		/// <summary>
		/// Generates list of basic data for villages in the sidebar list
		/// Suported versions: 4, 4.2, 4.4
		/// </summary>
		/// <returns type="Array[{ name: string, id: integer, isActive: boolean }]">Returns array of retrieved data from villages list</returns>

		// Create new empty array - result
		var data = [];

		if (ActivePageTravianVersion === "4") {
			$("#villageList .entry").each(function () {
				data.push({
					name: $(" > a", this).text(),
					id: parseInt($(" > a", this).attr("href").replace("?newdid=", ""), 10) || 0,
					isActive: $(this).hasClass("active")
				});
			});
		} else if (ActivePageTravianVersion === "4.2" || ActivePageTravianVersion === "4.4") {
			$("#sidebarBoxVillagelist div.content > ul > li").each(function () {
				data.push({
					name: $("> a > div", this).text().trim(),
					id: parseInt($("> a", this).attr("href").replace("?newdid=", ""), 10) || 0,
					isActive: $(this).hasClass("active")
				});
			});
		} else throw ("Unsuported travian version");

		// Return array
		return data;
	};

	var CrawlMessages = function () {
		/// <summary>
		/// Crawls for new user reports
		/// </summary>

		Log("Crawling messages...", "Services");

		var currentReportsCount = parseInt($(".messages > div.bubble > .bubble-content").text(), 10) || 0;
		ActiveProfile.Messages.UnreadCount = currentReportsCount;

		// Check if on Messages page
		if (MatchPages([Enums.TravianPages.Messages])) {
			// Check if on 'Inbox' tab
			if ($(".messages .container.active a[href*='t=0']").length ||
				$(".messages .container.active a[href*='t=2']").length) {
				DLog("On messages page. Crawling message details.", "Services");

				if ($(".paper").length) {
					// We are in write/read mode
					var messageID = $(".paper #answer input:eq(0)").attr("value");
					var messageContent = $("#message").html();

					// Check if message is already crawled
					if (ActiveProfile.Messages.Inbox[messageID]) {
						ActiveProfile.Messages.Inbox[messageID].Content = messageContent;
					} else if (ActiveProfile.Messages.Sent[messageID]) {
						ActiveProfile.Messages.Sent[messageID].Content = messageContent;
					} else {
						Warn("No message with same ID [" + messageID + "]", "Services");
						return;
					}

					DLog("Message [" + messageID + "] content set.", "Services");
				} else {
					// Go throigh all message lines and crawl data
					$(".inbox > tbody > tr").each(function() {
						var messageElement = $(this);

						// Get message details
						var message = new Models.Message();

						// Get message subject and ID
						var messageLink = $(".subject a", messageElement);
						message.MID = parseInt(messageLink.attr("href").replace("nachrichten.php?id=", "")).toString();
						message.IsRead = $(".subject img", messageElement).hasClass("messageStatusRead");
						message.Subject = $.trim(messageLink.text());

						// Get message sender
						var sender = $(".send a", messageElement);
						message.From = sender.text();
						message.FromUID = sender.attr("href").replace("spieler.php?uid=", "");

						// Get message date
						var date = $(".dat", messageElement).text();
						var dateSplit = date.split("/");
						if (dateSplit.length < 3) {
							// Message arrived today
							var dateNow = new Date();
							var timeSplit = date.split(" ")[1].split(":");
							message.Date = (new Date(dateNow.getYear() + 1900, dateNow.getMonth(), dateNow.getDate(), timeSplit[0], timeSplit[1])).getTime();
						} else {
							// Message arrives some day before today
							var timeSplit = dateSplit[2].split(" ")[1].split(":");
							message.Date = (new Date("20" + dateSplit[0], dateSplit[1], parseInt(dateSplit[2], 10) || 0, timeSplit[0], timeSplit[1])).getTime();
						}

						if ($(".messages .container.active a[href*='t=0']").length)
							ActiveProfile.Messages.Inbox[message.MID] = message;
						else ActiveProfile.Messages.Sent[message.MID] = message;
					});
				}
			}
		}
		DLog("Services: CrawlReports found [" + currentReportsCount + "] new messages");
	};

	var CrawlHero = function () {
		/// <summary>
		/// Crawls for hero information
        //// This method crawls pages to know hero's state
		/// </summary>

        var canAdventure = $('.heroStatusMessage .heroStatus100').length != 0;
        var hasAdventure = (parseInt($('.adventureWhite .speechBubbleContent').text(), 10) || 0) >= 1;

        ActiveProfile.Hero.CanAdventure = canAdventure;
        ActiveProfile.Hero.HasAdventure = hasAdventure;

		DLog("Services: CrawlHero found canAdventure = '" + canAdventure + "'");
		DLog("Services: CrawlHero found hasAdventure = '" + hasAdventure + "'");
	};

	var CrawlReports = function () {
		/// <summary>
		/// Crawls for new user reports
		/// </summary>

		var currentReportsCount = parseInt($(".reports .bubble-content").text(), 10) || 0;

		// Check if on Reports page
		if (MatchPages([Enums.TravianPages.Reports])) {
			// TODO Implement
		}
		else {
			ActiveProfile.Reports.UnreadCount = currentReportsCount;
		}

		DLog("Services: CrawlReports found [" + currentReportsCount + "] new reports");
	};

	var CrawlVillagesDetails = function () {
		/// <summary>
		/// Crawls for villages details
		/// </summary>

		$.each(ActiveProfile.Villages, function (index, obj) {
			// Get village detailc table
			var village = $("#villages tbody tr").find("td:contains('"+obj.Name+"')").parent();

			// Crawl IsMainCity
			var checkMainCity = ($(".name", village).has(".mainVillage").length ? true : false);
			ActiveProfile.Villages[index].IsMainCity = checkMainCity;
			DLog("Services: " + obj.Name + " " + (checkMainCity ? "is" : "isn't") + " main city");

			// Crawl village population
			var villagePop =  parseInt($(".inhabitants", village).text(), 10) || 0;
			ActiveProfile.Villages[index].Population = villagePop;
			DLog("Services: Population of "+obj.Name+" is ["+villagePop+"]");

			// Crawl village position X Coordinate
			var PositionX = $(".coordinateX", village).text();
			PositionX = parseInt(PositionX.replace("(",""), 10) || 0;
			ActiveProfile.Villages[index].Position.x = PositionX;

			// Crawl village position Y coordinate
			var PositionY = $(".coordinateY", village).text();
			PositionY = parseInt(PositionY.replace(")",""), 10) || 0;
			ActiveProfile.Villages[index].Position.y = PositionY;

			DLog("Services: Coordinates for "+obj.Name+" are [("+PositionX+"|"+PositionY+")]");
		});
	};

	var CrawlVillageType = function () {
		/// <summary>
		/// Crawls village type
		/// </summary>

		var currentVillageType = $("#village_map").attr("class") || "f3";

		activeVillage.VillageOut.Type = currentVillageType;

		DLog("CrawlVillageType is [" + currentVillageType + "]", "Services");
	};

	var CrawlVillageFields = function () {
		/// <summary>
		/// Crawls field levels
		/// </summary>

		Log("Crawling VillageOut fields", "Services");

		var activeVillage = GetActiveVillage();
		$("#village_map .level").each(function (fieldIndex, fieldObj) {
			var field = $(fieldObj);
			var level = parseInt(field.text(), 10) || 0;
			activeVillage.VillageOut.Levels[fieldIndex] = level;

			DLog("VillageOut Field(" + fieldIndex + ") at lvl." + level, "Services");
		});
	};

	var CrawlVillageBuildings = function() {
		// TODO Implement
	};

	var CrawlVillageTasks = function(type) {
		// TODO Implement
	};

	var CrawlVillageBuildTasks = function () {
		// TODO Implement
	};

	var CrawlVillageMovements = function () {
		// TODO Implement
	};

	var CrawlVillageTotalTroops = function () {
		// TODO Implement
	};

	var ProcessIsLogedIn = function () {
		/// <summary>
		/// Sets variable to true if user is logged in
		/// </summary>

		IsLogedIn = !IsNullOrEmpty($(".heroImage"));

		if (IsLogedIn) Log("User is loged in...", "Services");
		else Warn("User isn't loged in!", "Services");
	};

	var ProcessProfiles = function() {
		/// <summary>
		/// Sets profile object to AvailableProfiles
		/// </summary>

		Log("Processing profile...", "Services");

		// Can't get active user if user isn't loged in
		if (!IsLogedIn)
			LazyMatchExistingProfile();
		else MatchExistingProfile();
	};

	var MatchExistingProfile = function () {
		/// <summary>
		/// Tryes to match existing profile to currently active profile
		/// so that user can be loged in. This is full match meaning that
		/// only profiles with same UID or name, and server are matched
		/// Supported versions: dependency
		/// </summary>
		/// <returns type="boolean">Returns indicator wheter matching was successful</returns>

		var activeProfileUID = 0;
		var activeProfileName = "Unknown";
		var activeProfileTribeID = "1";

		// Tryes to get active profile UID, name and tribe and match them to available profile
		try {
			DLog("Retrieving active profile info...", "Services");
			activeProfileUID = GetActiveProfileUID();
			activeProfileName = GetActiveProfileName();
			activeProfileTribeID = GetActiveProfileTribe();
			DLog("Active profile UID is [" + activeProfileUID + "] for \"" + activeProfileName + "\"", "Services");

			// Get matched profiles
			var matchedProfilesIndexes = GetMatchingProfilesIndexes(activeProfileUID, activeProfileName, ActiveServerAddress);

			// Check if multiple or none profiles were found
			if (matchedProfilesIndexes.length >= 1) {
				ActiveProfile = AvailableProfiles[matchedProfilesIndexes[0]];

				// Warning that profile was not matched unique
				if (matchedProfilesIndexes.length != 1) {
					Warn("Invalid number of profiles found that match current player [" + matchedProfilesIndexes.length + "]. Can't select profile automatically - selecting FIRST.", "Services");
				}
			}
		}
		catch (ex) {
			Warn("Couldn't retireve profile specific values. Creating new profile. Reason: ", ex);
		}

		// Update profile data (create new if none matched)
		if (matchedProfilesIndexes.length == 0)
			DLog("Creating new profile...", "Services");
		else DLog("Updating current active profile...", "Services");
		UpdateActiveProfile(activeProfileUID, activeProfileName, activeProfileTribeID);
		DLog("Profile updated!", "Services");

		return true;
	};

	var UpdateActiveProfile = function(uid, name, tribeID) {
		ActiveProfile = IsNullOrEmpty(ActiveProfile) ? new Models.Profile() : ActiveProfile;
		ActiveProfile.ServerAddress = ActiveServerAddress;
		ActiveProfile.Name = name;
		ActiveProfile.UID = uid;
		ActiveProfile.Tribe = Enums.Tribes[tribeID];
		ActiveProfile.ServerVersion = ActivePageTravianVersion;
	};

	var GetMatchingProfilesIndexes = function (uid, name, server) {
		/// <summary>
		/// Matches available profiles with given profile info
		/// Suported versions: all
		/// </summary>
		/// <param name="uid">UID of profiles to match</param>
		/// <param name="name">Name of profiles to match</param>
		/// <param name="server">Server address of profiles to match</param>
		/// <returns type="Array[integer]">Returns an list of integers, indexes of matched profiles</returns>

		// Search for matching profiles
		var matchedProfilesIndexes = [];
		for (var index = 0, cache = AvailableProfiles.length; index < cache; index++) {
			var currentProfile = AvailableProfiles[index];

			// Match using Server Address and, UID or name
			if (currentProfile.ServerAddress == server &&
				(currentProfile.UID == uid || currentProfile.Name == name)) {
				matchedProfilesIndexes.push(index);
			}
		}
		return matchedProfilesIndexes;
	};

	var LazyMatchExistingProfile = function () {
		/// <summary>
		/// Tryes to match existing profile to currently active profile
		/// so that user can be loged in. This is lazy version of matching
		/// that only uses server address to match to users
		/// (can'try match two users of same server)
		/// Supported versions: all
		/// </summary>
		/// <returns type="boolean">Returns indicator wheter matching was successful</returns>

		// Retrieve all profiles that match current server
		var matchedProfilesIndexes = [];
		for (var index = 0, cache = AvailableProfiles.length; index < cache; index++)
			if (AvailableProfiles[index].ServerAddress == ActiveServerAddress)
				matchedProfilesIndexes.push(index);

		// Check if multiple or none profiles were found
		DLog("Found [" + matchedProfilesIndexes.length + "] profiles", "Services");
		if (matchedProfilesIndexes.length != 1) {
			Warn("Invalid number of profiles found for current server [" + matchedProfilesIndexes.length + "]. Can't select profile automatically.", "Services");
			return false;
		}

		// Set active profile to matced profile
		ActiveProfile = AvailableProfiles[matchedProfilesIndexes[0]];
		return true;
	};

	var GetActiveProfileUID = function() {
		/// <summary>
		/// Matches element that contains profile UID and retrieves value
		/// Supported versions: 4, 4.2, 4.4
		/// </summary>
		/// <returns type="integer">Returns UID of active profile</returns>

		if (ActivePageTravianVersion === "4") {
			var profileLinkElement = $(".sideInfoPlayer .signLink").attr("src");
			return parseInt(profileLinkElement.replace("spieler.php?uid=", ""), 10) || 0;
		} else if (ActivePageTravianVersion === "4.2" || ActivePageTravianVersion === "4.4") {
			var imageSource = $(".sidebarBoxInnerBox .heroImage").attr("src");
			var start = imageSource.indexOf("uid");
			var end = imageSource.indexOf("&");
			return parseInt(imageSource.substr(start + 4, end - (start + 4)), 10) || 0;
		} else throw("Unsuported travian version");
	};

	var GetActiveProfileName = function () {
		/// <summary>
		/// Matches element that contains profile name and retrieves value
		/// Suported versions: 4, 4.2, 4.4
		/// </summary>
		/// <returns type="string">Returns active profile name</returns>

		if (ActivePageTravianVersion === "4") {
			return $(".sideInfoPlayer .signLink span").text().trim();
		} else if (ActivePageTravianVersion === "4.2" || ActivePageTravianVersion === "4.4") {
			return $(".sidebarBoxInnerBox .playerName").text().trim();
		} else throw("Unsuported travian version");
	};

	var GetActiveProfileTribe = function () {
		/// <summary>
		/// Matches element that contains currently active profile tribe and retrieves raw value
		/// Suported versions: 4, 4.2, 4.4
		/// </summary>
		/// <returns type="string">Returns raw tribe value (eg. '2' for teutons, etc.)</returns>

		if (ActivePageTravianVersion === "4") {
			return $(".sideInfoPlayer img").attr("class").replace("nationBig nationBig", "");
		} else if (ActivePageTravianVersion === "4.2" || ActivePageTravianVersion === "4.4") {
			return $(".sidebarBoxInnerBox .playerName > img").attr("class").replace("nation nation", "");
		} else throw("Unsuported travian version");
	};

	var GetActiveVillage = function () {
		/// <summary>
		/// Gets currently active village
		/// Suported versions: all
		/// </summary>
		/// <returns type="Models.Village">Models.Village object representing currently active village</returns>

		return ActiveProfile.Villages[ActiveVillageIndex];
	};

	var SaveActiveVillage = function () {
		/// <summary>
		/// Updates active village
		/// Suported versions: all
		/// </summary>

		ActiveProfile.Villages[ActiveVillageIndex] = activeVillage;
	};

	var SaveProfileChanges = function () {
		/// <summary>
		/// Updates AvailableProfiles list with new profile data
		/// Suported versions: all
		/// </summary>

		Log("Saving profile...", "Services");

		if (!IsLogedIn) {
			DLog("Can't save profile when user isn't loged in!", "Services");
			return;
		}

		var wasUpdated = false;

		// Search for profile to update
		for (var index = 0, cache = AvailableProfiles.length; index < cache; index++) {
			var obj = AvailableProfiles[index];

			// Check if current profile matched active profile
			if (obj.ServerAddress == ActiveProfile.ServerAddress && obj.UID == ActiveProfile.UID) {
				// Replace old data with new data
				AvailableProfiles[index] = ActiveProfile;

				wasUpdated = true;

				Log("Profile saved [" + obj.UID + "]", "Services");

				break;
			}
		}

		// If no profile was updated, create new profile
		// Adds new profile to the end of list
		if (!wasUpdated) {
			AvailableProfiles[AvailableProfiles.length] = ActiveProfile;

			Log("New Profile[" + ActiveProfile.UID + "] saved!", "Services");
		}

		// Sends request to save profiles list so that other plugins can use it
		(new Request("Background", "Data", "Profiles", { Type: "set", Value: AvailableProfiles })).Send();
	};
}

// Metadata for this plugin (Services)
var ServicesMetadata = {
	Name: "Services",
	Alias: "Services",
	Category: "Core",
	Version: "0.0.3.1",
	Description: "Takes care of all data retrieving and is requeired for all plugins",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		IsChangeable: false
	},

	Flags: {
		Alpha: true
	},

	Class: Services
};

// Adds this plugin to global list of available plugins
GlobalPluginsList.push($.extend(true, {}, Models.PluginMetadata, ServicesMetadata));
