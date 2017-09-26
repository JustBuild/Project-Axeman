/******************************************************************************
 * FieldUpgradeIndicator.js
 *
 * Author:
 * 		Aleksandar Toplek
 *
 * Collaborators:
 * 		Grzegorz Witczak
 *
 * Created on:
 * 		11.07.2012.
 *
 *****************************************************************************/

function UpgradeIndicator() {
  var isResourceEfficiencySidebarActive = true;

  /// <summary>
  /// Initializes object
  /// </summary>
  this.Register = function(settings) {
    // TODO Refactor
    // TODO Log

    Log("Registering UpgradeIndicator plugin...", "UpgradeIndicator");

    $("head").append(
      CreateStylesheet(
        "Plugins/Economy/UpgradeIndicator/UpgradeIndicatorStyle.css"
      )
    );

    // Retrieve settings
    isResourceEfficiencySidebarActive = RetrieveCustomSettingValue(
      settings,
      "ResourceEfficiencySidebar"
    );
    var upgradeableColor = RetrieveCustomSettingValue(
      settings,
      "UpgradeableColor"
    );
    var underConstructionColor = RetrieveCustomSettingValue(
      settings,
      "UnderConstructionColor"
    );
    var nonUpgradeableColor = RetrieveCustomSettingValue(
      settings,
      "NonUpgradeableColor"
    );
    var maxUpgradedColor = RetrieveCustomSettingValue(
      settings,
      "MaxUpgradedColor"
    );
    var noResourcesColor = RetrieveCustomSettingValue(
      settings,
      "NoResourcesColor"
    );

    // Append color settings
    var configurableStyle =
      ".PAUIElement.Upgradeable { background-color: " +
      upgradeableColor +
      " !important; }" +
      ".PAUIElement.UnderConstruction { background-color: " +
      underConstructionColor +
      " !important; }" +
      ".PAUIElement.NonUpgradeable { background-color: " +
      nonUpgradeableColor +
      " !important; }" +
      ".PAUIElement.MaxUpgraded { background-color: " +
      maxUpgradedColor +
      " !important; }" +
      ".PAUIElement.NoResources { background-color: " +
      noResourcesColor +
      " !important; }";
    $("head").append("<style>" + configurableStyle + "</style>");

    // Check if we can apply states
    if (MatchPages([Enums.TravianPages.VillageOut])) FieldUpgradeIndicator();
    if (MatchPages([Enums.TravianPages.VillageIn])) BuildingUpgradeIndicator();
  };

  var FieldUpgradeIndicator = function() {
    // Get village levels map
    var villageType =
      ActiveProfile.Villages[ActiveVillageIndex].VillageOut.Type;
    var availableFields = Enums.VillageOutMaps[villageType];
    var resEfficiency = [];

    // Go through all available resource types
    for (
      var rIndex = 0, rcache = availableFields.length;
      rIndex < rcache;
      rIndex++
    ) {
      DLog(
        "---------" +
          Enums.FieldNames[rIndex] +
          ":" +
          availableFields[rIndex].length
      );
      // Go through all available fields for specific resource type
      for (
        var fIndex = 0, fcache = availableFields[rIndex].length;
        fIndex < fcache;
        fIndex++
      ) {
        var field = $(
          "#village_map .level:eq(" + availableFields[rIndex][fIndex] + ")"
        );

        DLog("Index: " + availableFields[rIndex][fIndex]);

        var fieldLevel =
          ActiveProfile.Villages[ActiveVillageIndex].VillageOut.Levels[
            availableFields[rIndex][fIndex]
          ];
        fieldLevel = field.hasClass("underConstruction")
          ? fieldLevel + 1
          : fieldLevel;
        var fieldMaxLevel = ActiveProfile.Villages[ActiveVillageIndex]
          .IsMainCity
          ? 20
          : 10;

        // Get upgrade cost for current level
        var fieldUpgradeCost = Enums.Fields[rIndex][fieldLevel];

        // Check if field is under construction
        if (field.hasClass("underConstruction")) {
          SetUIElementState(field, "UnderConstruction");
          continue; // Skip to next field
        }

        var fieldUpgradeState = "Upgradeable";

        // Check if max upgraded
        if (fieldLevel >= fieldMaxLevel || field.hasClass("maxLevel")) {
          SetUIElementState(field, "MaxUpgraded");
          continue; // Skip to next field
        }

        // Show upgrade efficiency
        if (
          fieldLevel < fieldMaxLevel &&
          fieldUpgradeCost &&
          fieldUpgradeCost.length >= 4
        ) {
          var total =
            fieldUpgradeCost[0] +
            fieldUpgradeCost[1] +
            fieldUpgradeCost[2] +
            fieldUpgradeCost[3];
          var rPerWheat =
            fieldUpgradeCost[4] > 0
              ? Math.floor(total / fieldUpgradeCost[4])
              : 0;

          if (rPerWheat > 0) {
            var resEfficiencyit = [
              rPerWheat,
              fieldLevel,
              Enums.FieldNames[rIndex],
              availableFields[rIndex][fIndex] + 1
            ];
            resEfficiency.push(resEfficiencyit);
          }
        }

        // Go through all resources
        for (var resource = 0; resource < 4; resource++) {
          // Get currently max storage capacity and check if we can upgrade
          var canStoreResource =
            ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[
              resource
            ];
          if (fieldUpgradeCost[resource] > canStoreResource) {
            fieldUpgradeState = "NonUpgradeable";
            break; // Skip to next field
          }

          // Check if enough resource is stored in order to upgrade field
          var availableResource =
            ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[
              resource
            ];
          var costDiff = availableResource - fieldUpgradeCost[resource];
          if (costDiff < 0) {
            fieldUpgradeState = "NoResources";
            // NOTE: This can't break because we have to check for
            // warehouse/granary cost difference even if we can't
            // upgrade field. Can be case where we can't upgarade
            // because of wood and we would break at first itteration
            // but field clay cost is larger than what can be store.
          }
        }

        if (
          fieldUpgradeCost &&
          fieldUpgradeCost.length >= 4 &&
          ActiveProfile.Villages[ActiveVillageIndex].Resources.FreeCrop <
            fieldUpgradeCost[4]
        ) {
          fieldUpgradeState = "NonUpgradeable";
        }

        // Set field state
        SetUIElementState(field, fieldUpgradeState);
      }
    }

    // Efficiency sidebar
    if (isResourceEfficiencySidebarActive) {
      if (resEfficiency.length) {
        resEfficiency.sort(function(a, b) {
          return a[0] - b[0];
        });

        var html = "<ul>";
        for (var i = 0; i < resEfficiency.length; i++) {
          html +=
            '<li><a href="build.php?id=' +
            resEfficiency[i][3] +
            '">' +
            (i + 1) +
            ". Level " +
            resEfficiency[i][1] +
            " " +
            resEfficiency[i][2] +
            "</a></li>";
        }
        html += "</ul>";
        CreateTravianSidebar("Simmer's Queue", '<p>Follow this list to spend the least amount of resources to gain the most amount of population.</p>' + html);
      }
    }
  };

  var BuildingUpgradeIndicator = function() {
    // TODO Simplify - Nesting too deep

    // Get village levels map
    var villageMap = $("#village_map");
    var GIDs = Enums.VillageInGID;
    var buildings = $("img", villageMap).not(
      ".iso, .clickareas, #lswitch, .onTop"
    );

    var resEfficiency = [];
    buildings.each(function(index) {
      var levelObject = $("#levels div.labelLayer", villageMap)[index];

      // Get current building level and GID
      // TODO Pull this from profile.village model
      var buildingLevel = parseInt($(levelObject).text(), 10) || 0;
      buildingLevel = $(levelObject).parent('.colorLayer').is(".underConstruction")
        ? buildingLevel + 1
        : buildingLevel;

      var buildingGID = $(this)
        .attr("class")
        .match(/g([0-9]{1,2})/)[1];
      var building = Enums.Buildings[GIDs[buildingGID]];
      var buildingUpgradeCost = building[buildingLevel];

      if (!$(levelObject).parent('.colorLayer').is(".underConstruction")) {
        DLog("------" + buildingGID + ": " + GIDs[buildingGID]);

        var upgradeState = "Upgradeable";
        if (buildingLevel < building.length) {

          for (var rrIndex = 0; rrIndex < 4; rrIndex++) {
            // Check if village have warehouse/granary large enough to upgrade field
            var canStoreResource =
              ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[
                rrIndex
              ];

            if (buildingUpgradeCost[rrIndex] > canStoreResource) {
              upgradeState = "NonUpgradeable";
              break;
            } else {
              // Check if enough resources is stored to allow upgrade
              var availableResource =
                ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[
                  rrIndex
                ];
              var costDiff = availableResource - buildingUpgradeCost[rrIndex];
              if (costDiff < 0) {
                upgradeState = "NoResources";
                // NOTE: This can't break because we have to check for
                // warehouse/granary cost difference even if we can't
                // upgrade field. Can be case where we can't upgarade
                // because of wood and we would break at first itteration
                // but field clay cost is larger than what can be store.
              }
            }

            DLog(
              "Storage: " +
                canStoreResource +
                " Cost[" +
                rrIndex +
                "]: " +
                buildingUpgradeCost[rrIndex] +
                " for lvl." +
                (buildingLevel + 1)
            );
          }
        } else {
          upgradeState = "MaxUpgraded";
        }
      } else {
        upgradeState = "UnderConstruction";
      }

      if (
        buildingUpgradeCost &&
        buildingUpgradeCost.length >= 4 &&
        ActiveProfile.Villages[ActiveVillageIndex].Resources.FreeCrop <
          buildingUpgradeCost[4]
      ) {
        upgradeState = "NonUpgradeable";
      }

      // Show upgrade efficiency
      if (
        buildingLevel < building.length &&
        buildingUpgradeCost &&
        buildingUpgradeCost.length >= 4
      ) {

        var total =
          buildingUpgradeCost[0] +
          buildingUpgradeCost[1] +
          buildingUpgradeCost[2] +
          buildingUpgradeCost[3];
        var rPerWheat =
          buildingUpgradeCost[4] > 0
            ? Math.floor(total / buildingUpgradeCost[4])
            : 0;

        if (rPerWheat > 0) {
          var resEfficiencyit = [
            rPerWheat,
            buildingLevel,
            GIDs[buildingGID],
            buildingGID
          ];
          resEfficiency.push(resEfficiencyit);
        }
      }

      SetUIElementState(levelObject, upgradeState);
    });

    // Efficiency sidebar
    if (isResourceEfficiencySidebarActive) {
      if (resEfficiency.length) {
        resEfficiency.sort(function(a, b) {
          return a[0] - b[0];
        });

        var html = "<ul>";
        for (var i = 0; i < resEfficiency.length; i++) {
          html +=
            '<li><a href="build.php?gid=' +
            resEfficiency[i][3] +
            '">' +
            (i + 1) +
            ". L" +
            resEfficiency[i][1] +
            " R" + resEfficiency[i][0] +
            " " +
            resEfficiency[i][2] +
            "</a></li>";
        }
        html += "</ul>";
        CreateTravianSidebar("Simmer's Queue", '<p>Follow this list to spend the least amount of resources to gain the most amount of population.</p>' + html);
      }
    }
  };

  var SetUIElementState = function(field, state) {
    // Apply styles
    $(field).addClass("PAUIElement " + state);
  };
}

// Metadata for this plugin (UpgradeIndicator)
var UpgradeIndicatorMetadata = {
  Name: "UpgradeIndicator",
  Alias: "Upgrade Indicator",
  Category: "Economy",
  Version: "0.2.1.0",
  Description:
    "Know when you can upgrade fields and building without clicking for each. This plugin will highlight upgradeable fields and buildings for you.",
  Author: "JustBuild Development",
  Site: "https://github.com/JustBuild/Project-Axeman/wiki",

  Settings: {
    RunOnPages: [Enums.TravianPages.VillageIn, Enums.TravianPages.VillageOut],
    IsLoginRequired: true
  },

  CustomSettings: [
    {
      Name: "ResourceEfficiencySidebar",
      Header: "Show Resource Efficiency sidebar",
      Description:
        "Resource efficiency sidebar shows you what to upgrade next to maximize your population with least crop usage.",
      DataType: Enums.DataTypes.Boolean,
      DefaultValue: true
    },
    {
      Name: "UpgradeableColor",
      Header: "Upgradeable color",
      DataType: Enums.DataTypes.Color,
      DefaultValue: "#008000"
    },
    {
      Name: "UnderConstructionColor",
      Header: "Under construction color",
      DataType: Enums.DataTypes.Color,
      DefaultValue: "#FFAA44"
    },
    {
      Name: "NonUpgradeableColor",
      Header: "Non upgradeable color",
      DataType: Enums.DataTypes.Color,
      DefaultValue: "#FF0000"
    },
    {
      Name: "MaxUpgradedColor",
      Header: "Max upgraded color",
      DataType: Enums.DataTypes.Color,
      DefaultValue: "#C0C0C0"
    },
    {
      Name: "NoResourcesColor",
      Header: "No resources color",
      DataType: Enums.DataTypes.Color,
      DefaultValue: "#FFFFFF"
    }
  ],

  Flags: {
    Beta: true
  },

  Class: UpgradeIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(
  true,
  {},
  Models.PluginMetadata,
  UpgradeIndicatorMetadata
);
