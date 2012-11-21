/******************************************************************************
 * FieldUpgradeIndicator.js
 * 
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		11.07.2012.
 *
 *****************************************************************************/

function FieldUpgradeIndicator() {
	/// <summary>
	/// Initializes object 
	/// </summary>
	this.Register = function () {
		// TODO Refactor
		// TODO Comment
		// TODO Log

		Log("FieldUpgradeIndicator: Registering FieldUpgradeIndicator plugin...");

		// For village in: $("#levels div:not(.underConstruction)").each(function (index, obj) {
		if (MatchPages(Enums.TravianPages.VillageOut)) {
			// Get village levels map
			var villageMap = $("#village_map");
			var villageType = ActiveProfile.Villages[ActiveVillageIndex].VillageOut.Type;
			var availableFields = Enums.VillageOutMaps[villageType];
			$(".level", villageMap).each(function (levelIndex, levelObject) {
				if (!$(this).is(".underConstruction")) {
					var processed = false;

					// Get current field level
					var fieldLevel = parseInt($(this).text(), 10) || 0;

					// Go through all available resource tyoes
					for (var rIndex = 0, cache = availableFields.length; rIndex < cache; rIndex++) {
						var fIndex = 0;
						var loopCache = availableFields[rIndex].length;
						// Go through all available fields for specific resource type
						for (; fIndex < loopCache; fIndex++) {
							if (levelIndex == availableFields[rIndex][fIndex]) {
								// If we found filed type, we can retrieve cost
								// from Enums.Fields
								var fieldUpgradeCost = Enums.Fields[rIndex][fieldLevel];

								var canBeUpgraded = true;
								var upgradeable = true;
								for (var rrIndex = 0; rrIndex < 4; rrIndex++) {
									// Check if village have warehouse/granary large enough
									// to upgrade field
									var canStoreResource = ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[rrIndex];
									console.warn("Storage: " + canStoreResource + " Cost[" + rrIndex + "]: " + fieldUpgradeCost[rrIndex] + " for lvl." + (fieldLevel + 1));
									if (fieldUpgradeCost[rrIndex] > canStoreResource) {
										console.warn("Can Store:" + canStoreResource);
										console.warn("Cost: " + fieldUpgradeCost[rrIndex]);

										upgradeable = false;
										canBeUpgraded = false;
										break;
									}
									else {
										// Check if enough resources is stored to allow upgrade
										var availableResource = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[rrIndex];
										var costDiff = availableResource - fieldUpgradeCost[rrIndex];
										if (costDiff < 0) {
											canBeUpgraded = false;
											// NOTE: This can't break because we have to check for
											// warehouse/granary cost difference even if we cen't
											// upgrade field. Can be case where we can't upgarade
											// because of wood and we would break at first itteration
											// but field clay cost is larger than what can be store. 
										}
									}
								}

								generateLevelObject(levelObject, upgradeable, canBeUpgraded);

								processed = true;
								break;
							}
						}

						if (processed) break;
					}
				}
				else {
					$(this).css({
						"background-image": "none",
						"background-color": "#FA4",
						"border": "1px grey solid",
						"border-radius": "2em",
						"color": "black",
						"text-shadow": "0 0 3px silver",
						"text-decoration": "blink"
					});
				}
			});

		}
	};
	
	function generateLevelObject(levelObject, upgradeable, canBeUpgraded){
		if (!upgradeable) {
			$(levelObject).css({
				"background-image": "none",
				"background-color": "red",
				"border": "1px grey solid",
				"border-radius": "2em",
				"color": "white",
				"text-shadow": "0 0 3px black"
			});
		}
		else if (canBeUpgraded) {
			$(levelObject).css({
				"background-image": "none",
				"background-color": "green",
				"border": "1px grey solid",
				"border-radius": "2em",
				"color": "white",
				"text-shadow": "0 0 3px black"
			});
		}
		else{
			$(levelObject).css({
				"background-image": "none",
				"background-color": "white",
				"border": "1px grey solid",
				"border-radius": "2em",
				"color": "black",
				"text-shadow": "0 0 3px silver"
			});
		}
	}
};

// Metadata for this plugin (FieldUpgradeIndicator)
var FieldUpgradeIndicatorMetadata = {
	Name: "FieldUpgradeIndicator",
	Alias: "Field Upgrade Indicator",
	Category: "Economy",
	Version: "0.0.1.1",
	Description: "Know when you can upgrade fields without clicking on every field. This plugin will highlight upgradeable fields for you.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Flags: {
		Alpha: true
	},

	Class: FieldUpgradeIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, FieldUpgradeIndicatorMetadata);