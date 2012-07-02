/******************************************************************************
 * ResourceCalculator.js
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

// TODO Review and comment code
function ResourceCalculator() {
	this.Register = function () {
		if (!IsLogedIn) return;

		if (!MatchPages(Enums.TravianPages.Build)) return;

		//buildCalculateBuildingResourcesDifference
		//buildCalculateUnitResourcesDifference

		//devLog("buildCalculateBuildingResourcesDifference - Calculating building resource differences...");

		for (var rindex = 0; rindex < 4; rindex++) {
			var inWarehouse = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[rindex];

			// Building cost
			// .costs are for town hall celebration
			// .contractCosts are for building/upgreding building
			$(".contractCosts span:eq(" + rindex + ")").each(function (index) {
				var res = parseInt($(this).text(), 10);
				var diff = inWarehouse - res;
				var color = diff < 0 ? "#B20C08" : "#0C9E21";
				var div = "<div style='color:" + color + "; text-align:right;'>(" + diff + ")</div>";

				$(this).append(div);

				//devLog("buildCalculateBuildingResourcesDifference - r" + (rindex + 1) + " diff[" + diff + "]");
				$(this).append("<div id='paResourceDifferenceC" + index + "R" + rindex + "' style='text-align:right;'>" + ConvertHoursToTime(diff < 0 ? (-diff) / ActiveProfile.Villages[ActiveVillageIndex].Resources.Production[rindex] : 0) + "</div>");
				RefreshFunction("paResourceDifferenceC" + index + "R", '#0C9E21', '#AEBF61', '#A6781C', '#B20C08');
				if (rindex === 0) {
					setInterval(RefreshFunction, 1000, "paResourceDifferenceC" + index + "R", '#0C9E21', '#AEBF61', '#A6781C', '#B20C08');
				}
			});
		}

		var refreshRate = 128;

		var inputs = $("input[name*='t']");
		var costs = $(".details > .showCosts");

		for (var rindex = 0; rindex < 4; rindex++) {
			inputs.each(function (iindex) {
				$(costs[iindex]).children("span:eq(" + rindex  + ")").append(
					"<div id='paUnitCostDifferenceI" + iindex + "R" + rindex + "' style='color:#0C9E21; text-align:right;'>(0)</div>");
			});
		}

		setInterval(buildCalculateUnitResourcesDifferenceTimerFunction, refreshRate, [inputs, costs]);

		//devLog("buildCalculateBuildingResourcesDifference - Building resource differences calculated!");
	};

	var buildCalculateUnitResourcesDifferenceTimerFunction = function (args) {
		for (var rindex = 0; rindex < 4; rindex++) {
			var inWarehouse = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[rindex];

			args[0].each(function (iindex) {
				var res = parseInt($(args[1][iindex]).children("span:eq(" + rindex + ")").text(), 10);
				quantity = parseInt($(this).attr("value"), 10) || 0;
				// it's not intuitive if quantity is zero.
				if (quantity == 0) {
					quantity = 1;
				}
				var diff = inWarehouse - res * quantity;
				var color = diff < 0 ? "#B20C08" : "#0C9E21";
				$("#paUnitCostDifferenceI" + iindex + "R" + rindex).html("(" + diff + ")");
				$("#paUnitCostDifferenceI" + iindex + "R" + rindex).css("color", color);

				//if (dbgtmrs) devLog("buildCalculateUnitResourcesDifferenceTimerFunction - diff [" + diff + "]");
			});
		}
	}

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
					$(this).css("color", czero || "#B20C08");
				else if (hours < 0.75)
					$(this).css("color", calmost || "#B20C08");
				else if (hours < 3)
					$(this).css("color", cclose || "#CCA758");
				else
					$(this).css("color", cother || "black");
			});
		}
	};
};

// Metadata for this plugin (ResourceCalculator)
var ResourceCalculatorMetadata = {
	Name: "ResourceCalculator",
	Alias: "Resource Calculator",
	Category: "Economy",
	Version: "0.2.0.0",
	Description: "Shows you how much of each resource is needed to build field, building or train army. ",
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

	Class: ResourceCalculator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = ResourceCalculatorMetadata;