/******************************************************************************
 * ResourceCalculator.js
 * 
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		02.07.2012.
 *
 * ToDo:
 * 		Check crop balance in buildings
 *
 *****************************************************************************/

/// <summary>
/// Informs user how much resources is needed 
/// to build or train field, building or unit
/// and how long will it take to collect those 
/// resources
/// </summary>
function ResourceCalculator() {

	/// <summary>
	/// Initializes object 
	/// </summary>
	this.Register = function () {
		if (!IsLogedIn) {
			Log("ResourcesIndicator: User isn't loged in...");
			return;
		}

		if (!MatchPages(Enums.TravianPages.Build)) return;

		Log("ResourceCalculator: Registering ResourceCalculator plugin...");

		
		BuildCostCalculator();
		UnitCostCalculator();
	};

	var BuildCostCalculator = function () {
		/// <summary>
		/// Build cost calculator appends empty placeholders
		/// for resources and filled elements for time that
		/// are updated by refresh funuction
		/// </summary>

		Log("ResourceCalculator: Build cost appending...");

		for (var rindex = 0; rindex < 4; rindex++) {
			var resources = ActiveProfile.Villages[ActiveVillageIndex].Resources;
			var inWarehouse = resources.Stored[rindex];
			var production = resources.Production[rindex];
			var storage = resources.Storage[rindex];

			$(".contractCosts").each(function (cindex) {
				$("span:eq(" + rindex + ")", this).each(function () {
					// Get cost difference
					var res = parseInt($(this).text(), 10);
					var diff = inWarehouse - res;
					var color = diff < 0 ? "#B20C08" : "#0C9E21";

					// Crete element
					var costElement = $("<div>");
					costElement.attr("id", "ResourceCalculatorBuildCostC" + cindex + "R" + rindex);
					costElement.css({
						"color": color,
						"text-align": "right"
					});
					costElement.html("(" + diff + ")");
					$(this).append(costElement);

					DLog("ResourceCalculator - Appended cost element for resource [r" + (rindex + 1) + "] difference [" + diff + "]");

					// Get time difference
					if(production < 0 || storage < res){
						var timeDifference = "never";
					}
					else{
						var ratio = 0;
						if (diff < 0) {
							ratio = (-diff) / production;
						}
						var timeDifference = ConvertHoursToTime(ratio);
					}

					// create elements
					var timeElement = $("<div>");
					timeElement.attr("id", "ResourceCalculatorBuildFillTimeC" + cindex + "R" + rindex);
					timeElement.css("text-align", "right");
					timeElement.html(timeDifference);
					$(this).append(timeElement);

					DLog("ResourceCalculator: Appended time deeference element for resource [r" + (rindex + 1) + "] difference [" + timeDifference + "]");

					// create refresh data
					var data = {
						CostElementID: "ResourceCalculatorBuildCostC" + cindex + "R",
						TimeElementID: "ResourceCalculatorBuildFillTimeC" + cindex + "R",
						ColorZero: "#0C9E21",
						ColorLow: "#AEBF61",
						ColorMedium: "#A6781C",
						ColorHigh: "#B20C08"
					};

					// Initial refresh
					RefreshBuildFunction(data);

					// Set interval only once for each contract
					if (rindex === 0) {
						setInterval(RefreshBuildFunction, 1000, data);
					}
				});
			});
		}
	};
	
	/// <summary>
	/// Called in intervals to refresh times on elements and
	/// resource difference
	/// </summary>
	/// <param name="data">Data object</param>
	var RefreshBuildFunction = function (data) {
		for (var index = 0; index < 4; index++) {
			$("#" + data.TimeElementID + index).each(function () {
				if (hours != "never"){
					// Get current time from element
					var hours = ConvertTimeToHours($(this).text());

					// Not updating if 00:00:00
					if (hours > 0) {
						// Subtracts one second and writes new text to element
						hours -= 0.0002777006777777; // 1 s -> 1/~3600 (3601 because of calculation error)
						$(this).html(ConvertHoursToTime(hours));
					}

					// Changes element style (color) depending on current time state
					if (hours === 0)
						$(this).css("color", data.ColorZero || "#B20C08");
					else if (hours < 0.75)
						$(this).css("color", data.ColorLow || "#B20C08");
					else if (hours < 3)
						$(this).css("color", data.ColorMedium || "#CCA758");
					else
						$(this).css("color", data.ColorHigh || "black");
				}
			});
		}
	};

	/// <summary>
	/// Units cost calculator appends empty placeholders
	/// </summary>
	var UnitCostCalculator = function () {
		DLog("ResourceCalculator: Unit cost appending...");

		// Refresh rate in ms
		var refreshRate = 128;

		var inputs = $("input[name*='t']");
		var costs = $(".details > .showCosts span[class*='resources']");

		for (var rindex = 0; rindex < 4; rindex++) {
			$.each(inputs, function (iindex) {
				var costElement = $("<div>");
				costElement.attr("id", "ResourceCalculatorU" + iindex + "R" + rindex);
				costElement.css("color", "#0C9E21");
				costElement.css("text-align", "right");
				costElement.html("(0)");
				$(costs[iindex*5+rindex]).append(costElement);
			});
		}

		var data = {
			ElementID: "ResourceCalculatorU",
			Inputs: inputs,
			UnitCosts: costs
		};
		console.warn(data);
		setInterval(RefreshUnitsFunction, refreshRate, data);
	};

	/// <summary>
	/// Refreshes units cost elements
	/// </summary>
	/// <param name="data">Refresh data object</param>
	var RefreshUnitsFunction = function (data) {
		for (var rindex = 0; rindex < 4; rindex++) {
			var inWarehouse = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[rindex];

			// Go through all inputs
			data.Inputs.each(function (iindex) {
				// Get resource cost
				var costElement = $(data.UnitCosts[iindex*5+rindex]);
				var resourceCost = parseInt(costElement.text(), 10);

				// Get quantity
				var quantityValue = $(this).attr("value");
				var quantity = parseInt(quantityValue, 10) || 1;
				
				// Change quantity zero to one for intuitive results
				if (quantity == 0) 
					quantity = 1;

				// Calculate difference
				var diff = inWarehouse - resourceCost * quantity;
				var color = diff < 0 ? "#B20C08" : "#0C9E21";

				// Update elements
				$("#" + data.ElementID + iindex + "R" + rindex).html("(" + diff + ")");
				$("#" + data.ElementID + iindex + "R" + rindex).css("color", color);
			});
		}
	};
};

// Metadata for this plugin (ResourceCalculator)
var ResourceCalculatorMetadata = {
	Name: "ResourceCalculator",
	Alias: "Resource Calculator",
	Category: "Economy",
	Version: "0.2.0.1",
	Description: "Shows you how much of each resource is needed to build field, building or train army. ",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Flags: {
		Beta: true
	},

	Class: ResourceCalculator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, ResourceCalculatorMetadata);