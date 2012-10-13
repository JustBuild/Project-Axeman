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

		var circleURL = "url(" + GetURL("Plugins/Economy/FieldUpgradeIndicator/Resources/indicators.png") + ")";
		// For village in
		//$("#levels div:not(.underConstruction)").each(function (index, obj) {
		if (MatchPages(Enums.TravianPages.VillageOut)) {
			// Get village levels map
			var villageMap = $("#village_map");
			var villageType = villageMap.attr("class");
			var availableFields = Enums.VillageOutMaps[villageType];
			$(".level", villageMap).each(function (levelIndex, levelObject) {
				if (!$(this).is(".underConstruction")) {
					var processed = false;

					// Get current field level
					var fieldLevel = parseInt($(this).text(), 10);

					// Go through all available resource tyoes
					for (var rIndex = 0, cache = availableFields.length; rIndex < cache; rIndex++) {
						// Go through all available fields for specific resource type
						var fIndex = 0;
						var loopCache = availableFields[rIndex].length;
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
									var canStoreResource = ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[rrIndex]
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

								if (!upgradeable) {
									var element = $(levelObject);
									element.css("background-image", circleURL);
									element.css("background-position-y", "-23px");
									element.css("color", "white");
									element.css("text-shadow", "0 0 3px black");
								}
								else if (canBeUpgraded) {
									var element = $(levelObject);
									element.css("background-image", circleURL);
									element.css("color", "white");
									element.css("text-shadow", "0 0 3px black");
								}

								processed = true;
								break;
							}
						}

						if (processed) break;
					}
				}
			});

		}
	};
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

	Class: FieldUpgradeIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = FieldUpgradeIndicatorMetadata;