/******************************************************************************
 * ResourceIndicator.js
 *
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		02.07.2012.
 *
 *****************************************************************************/

/// <summary>
/// Informs user about warehouse and granary
/// overflow by showing time untill filled under
/// resources bar
/// </summary>
function ResourceIndicator() {
	function AppendResourceChild(child, index) {
		// Skips crop consumption
		if (index == 4)
			return true;
		var actualProduction = ActiveProfile.Villages[ActiveVillageIndex].Resources.Production[index];

		// Create element to append
		var element = $("<div><b><p>");
		$("p", element).addClass("ResourceIndicatorFillTime");
		$("p", element).css("text-align", "right");
		$("p", element).html("never");

		if (actualProduction == 0) {
			// If there is no production, append
			// element that contains only "never"
			$(child).append(element);
		}
		else {
			// Calculate time left
			var current = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[index];
			var timeLeft = 0;
			if (actualProduction > 0) {
				var max = ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[index]
				timeLeft = (max - current) / actualProduction;
			}
			else {
				timeLeft = current / Math.abs(actualProduction);

				$("p", element).css("color", "red");
				$("p", element).addClass("negative");
			}

			// Fill tile left and append to child
			$("p", element).data("timeleft", timeLeft * 3600);
			$(child).append(element);
		}

		// Style for T4.4
		if (ActivePageTravianVersion === "4.4") {
			$(".ResourceIndicatorFillTime").css({
				"background": "-webkit-linear-gradient(top, rgba(237, 237, 237, 0) 0%,rgba(224, 231, 241, 0.85) 20%) !important",
				"height": "25px !important",
				"position": "absolute !important",
				"right": "2px !important",
				"top": "10px !important",
				"width": "76px !important",
				"border-bottom-left-radius": "10px !important",
				"border-bottom-right-radius": "10px !important",
				"box-shadow": "0px 1px 2px #888 !important",
				"text-align": "center !important",
				"line-height": "26px !important"
			});
		}

		DLog("ResourcesIndicator: Appended to resource [l" + (index + 1) + "]");
	}

	this.Register = function () {
		/// <summary>
		/// Initializes object
		/// </summary>

		if (MatchPages([
			Enums.TravianPages.Home,
			Enums.TravianPages.Login,
			Enums.TravianPages.Logout])) return;

		Log("ResourcesIndicator: Registering ResourceIndicator plugin...");

		var resourceHolders;
		if (ActivePageTravianVersion === "4" || ActivePageTravianVersion === "4.2") {
			resourceHolders = $("#res").children();

			//Indicator beautifer
			$("#res").css({
				"background": "-webkit-linear-gradient(top, rgba(237, 237, 237, 0) 0%,rgba(224, 231, 241, 0.98) 50%) !important",
				"width": "589px !important",
				"border-bottom-left-radius": "10px !important",
				"border-bottom-right-radius": "10px !important",
				"box-shadow": "0px 1px 2px #888 !important"
			});
		}
		else if (ActivePageTravianVersion === "4.4") {
			resourceHolders = $("#stockBar .stockBarButton");
		}
		else throw ("Unsuported travian version");

		// Appends calculated time to page
		resourceHolders.each(function (index) {
			AppendResourceChild(this, index);
		});

		// Initial refresh
		RefreshFunction();

		var interval = 1000;
		setInterval(RefreshFunction, interval);
		DLog("ResourcesIndicator: Timer registered to interval [" + interval + "]");
	};

	/// <summary>
	/// Called in intervals to refresh times on elements
	/// </summary>
	/// <param name="cneg">Color for negative value</param>
	/// <param name="czero">Color for hours >= 3</param>
	/// <param name="calmost">Color for hours < 3</param>
	/// <param name="cclose">Color for hours < 0.75</param>
	/// <param name="cother">Color for hours = 0</param>
	function RefreshFunction(cneg, czero, calmost, cclose, cother) {
		$(".ResourceIndicatorFillTime").each(function () {
			// Get current time from element
			var secondsLeft = $(this).data("timeleft");
			if (secondsLeft >= 0) {
				if (secondsLeft > 0) {
					secondsLeft--;
					$(this).data("timeleft", secondsLeft);
				}
				$(this).html(ConvertSecondsToTime(secondsLeft));
			}

			if ($(this).hasClass("negative")) {
				$(this).css("color", cneg || "#C00");
			}
			else {
				// Changes element style (color) depending on current time state
				if (secondsLeft === 0)
					$(this).css("color", czero || "#C00");
				else if (secondsLeft < 2700)
					$(this).css("color", calmost || "#B20C08");
				else if (secondsLeft < 10800)
					$(this).css("color", cclose || "#A6781C");
				else $(this).css("color", cother || "#0C9E21");
			}
		});
	};
};

// Metadata for this plugin (ResourceIndicator)
var ResourceIndicatorMetadata = {
	Name: "ResourceIndicator",
	Alias: "Resource Indicator",
	Category: "Economy",
	Version: "0.2.4.0",
	Description: "Shows how long is needed for warehouse and granary to fill up to its maximum capacity and alerts accordingly.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		IsLoginRequired: true
	},

	Flags: {
		Beta: true
	},

	Class: ResourceIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, ResourceIndicatorMetadata);