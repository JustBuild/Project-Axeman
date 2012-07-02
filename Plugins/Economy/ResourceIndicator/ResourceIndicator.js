/******************************************************************************
 * ResourceIndicator.js
 * 
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		02.07.2012.
 *
 * Notes:
 *			TODO
 *
 *****************************************************************************/


// TODO Review na comment code
function ResourceIndicator() {
/**
 * Informs about warehouse and granary overflow
 *
 * @author Aleksandar Toplek
 */
	this.Register = function () {
		if (!IsLogedIn) return;

		if (!MatchPages(
			Enums.TravianPages.Player,
			Enums.TravianPages.VillageOut,
			Enums.TravianPages.VillageIn,
			Enums.TravianPages.VillageView,
			Enums.TravianPages.Build,
			Enums.TravianPages.Map,
			Enums.TravianPages.MapPosition,
			Enums.TravianPages.Statistics,
			Enums.TravianPages.Reports,
			Enums.TravianPages.Messages,
			Enums.TravianPages.Alliance,
			Enums.TravianPages.HeroLook,
			Enums.TravianPages.HeroInventory,
			Enums.TravianPages.HeroAdventures,
			Enums.TravianPages.HeroAuctions,
			Enums.TravianPages.Plus,
			Enums.TravianPages.Help)) {
			return;
		}
		//devLog("globalOverflowTimer - Initializing...");

		$("#res").children().each(function (index) {
			// Skips crop consumption
			if (index !== 4) {
				var actualProduction = ActiveProfile.Villages[ActiveVillageIndex].Resources.Production[index];
				if (actualProduction == 0) {
					$(this).append("<div style='background-color: #EFF5FD;'><b><p id='ResourceIndicator" + index + "' style='text-align: right;'>" + "never" + "</p></b></div>");
				}
				else {
					var current = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[index];

					if (actualProduction > 0) {
						var max = index == 3 ?
							ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[1] :
							ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[0];
						var timeLeft = (max - current) / actualProduction;

						$(this).append("<div style='background-color: #EFF5FD;'><b><p id='ResourceIndicator" + index + "' style='text-align: right;'>" + ConvertHoursToTime(timeLeft) + "</p></b></div>");
					}
					else {
						var timeLeft = current / Math.abs(actualProduction);

						$(this).append("<div style='background-color: #EFF5FD;  color:red !important; border: 1px solid red;'><b><p id='ResourceIndicator" + index + "' style='text-align: right;'>" + _hoursToTime(timeLeft) + "</p></b></div>");

					}
				}
				//devLog("globalOverflowTimer - l" + (index + 1) + " appended!");

			}
		});

		RefreshFunction("ResourceIndicator");

		setInterval(RefreshFunction, 1000, "ResourceIndicator");
		//devLog("globalOverflowTimer - Timer registered!");

		//devLog("globalOverflowTimer - Finished!");
	};

	/// <summary>
	/// Called in intervals to refresh times on elements
	/// </summary>
	/// <param name="id">Elements id tag</param>
	/// <param name="czero">Color for hours >= 3</param>
	/// <param name="calmost">Color for hours < 3</param>
	/// <param name="cclose">Color for hours < 0.75</param>
	/// <param name="cother">Color for hours = 0</param>
	function RefreshFunction(id, czero, calmost, cclose, cother) {
		for (var index = 0; index < 4; index++) {
			$("#" + id + index).each(function () {
				// Get current time from element
				var hours = ConvertTimeToHours($(this).text());

				//if (dbgtmrs) devLog("globalOverflowTimerFunction - l" + (index + 1) + "   " + $(this).text() + "    " + hours);

				// Not updating if 00:00:00
				if (hours > 0) {
					// Subtracts one second and writes new text to element
					hours -= 0.0002777006777777; // 1 s -> 1/~3600 (3601 because of calculation error)
					$(this).html(ConvertHoursToTime(hours));
				}

				// Changes element style (color) depending on current time state
				if (hours === 0)
					$(this).css("color", czero || "black");
				else if (hours < 0.75)
					$(this).css("color", calmost || "#B20C08");
				else if (hours < 3)
					$(this).css("color", cclose || "#A6781C");
				else
					$(this).css("color", cother || "#0C9E21");
			});
		}
	};
};

// Metadata for this plugin (ResourceIndicator)
var ResourceIndicatorMetadata = {
	Name: "ResourceIndicator",
	Alias: "Resource Indicator",
	Category: "Economy",
	Version: "0.2.0.1",
	Description: "Shows how long is needed for warehouse and granary to fill up to its maximum capacity and alerts accordingly.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		HasSettings: false,
		SourceURL: ""
	},

	Flags: {
		Internal: false,
		Alpha: false,
		Beta: true,
		Featured: false
	},

	Class: ResourceIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = ResourceIndicatorMetadata;