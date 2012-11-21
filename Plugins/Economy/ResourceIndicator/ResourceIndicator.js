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

	/// <summary>
	/// Initializes object
	/// </summary>
	this.Register = function () {
		if (!IsLogedIn) {
			Log("ResourcesIndicator: User isn't loged in...");
			return;
		}

		if (MatchPages(
			Enums.TravianPages.Home,
			Enums.TravianPages.Login,
			Enums.TravianPages.Logout)) return;

		Log("ResourcesIndicator: Registering ResourceIndicator plugin...");

		//Indicator beautifer
		$("#res").css({
			"background": "-webkit-linear-gradient(top, rgba(224, 231, 241, 0) 0%,rgba(224, 231, 241, 1) 50%)",
			"width": "589px",
			"border-bottom-left-radius": "10px",
			"border-bottom-right-radius": "10px",
			"box-shadow": "0px 1px 3px #888"
		});

		// Appends calculated time to page
		$("#res").children().each(function (index) {
			// Skips crop consumption
			if (index == 4)
				return true;
			var actualProduction = ActiveProfile.Villages[ActiveVillageIndex].Resources.Production[index];
			console.log(actualProduction);

			// Create element to append
			var element = $("<div><b><p>");
			$("p", element).attr("id", "ResourceIndicator" + index);
			$("p", element).css("text-align", "right");
			$("p", element).html("never");

			if (actualProduction == 0) {
				$(this).append(element);
			}
			else {
				var current = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[index];

				if (actualProduction > 0) {
					var max = ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[index]
					var timeLeft = (max - current) / actualProduction;

					$("p", element).html(ConvertHoursToTime(timeLeft));
					$(this).append(element);
				}
				else {
					var timeLeft = current / Math.abs(actualProduction);

					$("p", element).css("color", "red");
					$("p", element).addClass("negative");
					$("p", element).html(ConvertHoursToTime(timeLeft));
					$(this).append(element);
				}
			}
			DLog("ResourcesIndicator: Appended to resource [l" + (index + 1) + "]");
		});

		// Initial refresh
		RefreshFunction("ResourceIndicator");

		var interval = 1000;
		setInterval(RefreshFunction, interval, "ResourceIndicator");
		DLog("ResourcesIndicator: Timer registered to interval [" + interval + "]");
	};

	/// <summary>
	/// Called in intervals to refresh times on elements
	/// </summary>
	/// <param name="id">Elements id tag</param>
	/// <param name="cneg">Color for negative value</param>
	/// <param name="czero">Color for hours >= 3</param>
	/// <param name="calmost">Color for hours < 3</param>
	/// <param name="cclose">Color for hours < 0.75</param>
	/// <param name="cother">Color for hours = 0</param>
	function RefreshFunction(id, cneg, czero, calmost, cclose, cother) {
		for (var index = 0; index < 4; index++) {
			$("#" + id + index).each(function () {
				// Get current time from element
				var hours = ConvertTimeToHours($(this).text());

				// Not updating if 00:00:00
				if (hours > 0) {
					// Subtracts one second and writes new text to element
					hours -= 0.0002777006777777; // 1 s -> 1/~3600 (3601 because of calculation error)
					$(this).html(ConvertHoursToTime(hours));
				}
				else if (hours < 0) {
					hours = 0;
				}
				
				if($(this).hasClass("negative")){
					$(this).css("color", cneg || "red");
				}
				else{
				// Changes element style (color) depending on current time state
					if (hours === 0)
						$(this).css("color", czero || "black");
					else if (hours < 0.75)
						$(this).css("color", calmost || "#B20C08");
					else if (hours < 3)
						$(this).css("color", cclose || "#A6781C");
					else
						$(this).css("color", cother || "#0C9E21");
				}
			});
		}
	};
};

// Metadata for this plugin (ResourceIndicator)
var ResourceIndicatorMetadata = {
	Name: "ResourceIndicator",
	Alias: "Resource Indicator",
	Category: "Economy",
	Version: "0.2.0.2",
	Description: "Shows how long is needed for warehouse and granary to fill up to its maximum capacity and alerts accordingly.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Flags: {
		Beta: true
	},

	Class: ResourceIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, ResourceIndicatorMetadata);