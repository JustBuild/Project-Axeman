/******************************************************************************
 * VillageListEnhancement.js
 *
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		24.11.2012.
 *
 *****************************************************************************/


function VillageListEnhancement() {
	// Constants
	var sortFunctionStorageKey = "VillageListEnhancementSort";
	var sortFunctionAscendingValue = "asc";
	var sortFunctionDescendingValue = "des";
	var sortFunctionHierachicalValue = "hie";


	/// <summary>
	/// Initializes object
	/// </summary>
	this.Register = function () {
		Log("Registering VillageListEnhancement plugin...", "VillageListEnhancement");

		// Inject styles
		$("head").append(CreateStylesheet("Plugins/Utility/VillageListEnhancement/VillageListEnhancementStyles.css"));

		initializeSortUI();	
		initializeBuildQueueUI();
	};

	// TODO Comment
	// TODO Implement
	// TODO Log
	var initializeBuildQueueUI = function() {

	};

	// TODO Comment
	var initializeSortUI = function() {
		// Retrieve village list and header
		var villageListPanel = $("#sidebarBoxVillagelist");
		var villageListHead = $(".content", villageListPanel);

		// Sort bar container
		var sortBar = $("<div>");

		// Message
		// TODO Localize
		var message = "<div style='float:left;margin-top:5px;'>Sort villages</div>";

		// Sort ascending button
		var buttonSortAsc = $("<div>");
		buttonSortAsc.addClass("sortButton");
		buttonSortAsc.addClass(sortFunctionAscendingValue);
		buttonSortAsc.css("background-image", "url('" + GetURL("Plugins/Utility/VillageListEnhancement/SortAscending.png") + "')");
		buttonSortAsc.attr("title", "Sort ascending");
		buttonSortAsc.click(sortVillageListAscending);

		// Sort descending button
		var buttonSortDesc = $("<div>");
		buttonSortDesc.addClass("sortButton");
		buttonSortDesc.addClass(sortFunctionDescendingValue);
		buttonSortDesc.css("background-image", "url('" + GetURL("Plugins/Utility/VillageListEnhancement/SortDescending.png") + "')");
		buttonSortDesc.attr("title", "Sort descending");
		buttonSortDesc.click(sortVillageListDescending);

		// Sort hierachical button
		var buttonSortHie = $("<div>");
		buttonSortHie.addClass("sortButton");
		buttonSortHie.addClass(sortFunctionHierachicalValue);
		buttonSortHie.css("background-image", "url('" + GetURL("Plugins/Utility/VillageListEnhancement/SortHierarchical.png") + "')");
		buttonSortHie.attr("title", "Sort hierachically");
		buttonSortHie.click(sortVillageListHiararchical);

		// Append buttons to list
		sortBar.append(message);
		sortBar.append(buttonSortHie);
		sortBar.append(buttonSortDesc);
		sortBar.append(buttonSortAsc);

		// Append sort bar container to the villages list
		villageListHead.append(sortBar);

		// Clearfix
		villageListHead.append($("<div>").css("clear", "both"));

		// Retrieve selected function
		getSelectedSortFunction(function(data) {
			// Call appropriate sort function
			// Call Ascending by default
			if (!data || data == sortFunctionAscendingValue)
				sortVillageListAscending();
			else if (data == sortFunctionDescendingValue)
				sortVillageListDescending();
			else sortVillageListHiararchical();
		});
	}

	// TODO Comment
	// TODO Log
	var sortVillageListAscending = function() {
		Log("Sorting villages list Ascending...", "VillageListEnhancement");

		// Sort Ascending
		$("#sidebarBoxVillagelist .content > ul > li").sortElements(function (a, b) {
			return $(".name", a).text() > $(".name", b).text() ? 1 : -1;
		});

		// Mark as active
		activateSortFunctionStyle(sortFunctionAscendingValue);

		// Save selection
		saveSelectedSortFunction(sortFunctionAscendingValue);
	};

	// TODO Comment
	// TODO Log
	var sortVillageListDescending = function () {
		Log("Sorting villages list Descending...", "VillageListEnhancement");

		// Sort Descending
		$("#sidebarBoxVillagelist .content > ul > li").sortElements(function (a, b) {
			return $(".name", a).text() > $(".name", b).text() ? -1 : 1;
		});

		// Mark as active
		activateSortFunctionStyle(sortFunctionDescendingValue);

		// Save selection
		saveSelectedSortFunction(sortFunctionDescendingValue);
	};

	// TODO Comment
	// TODO Log
	// TODO Implement
	var sortVillageListHiararchical = function() {
		Log("Sorting villages list Hierarchically...", "VillageListEnhancement");

		// Mark as active
		activateSortFunctionStyle(sortFunctionHierachicalValue);

		// Save selection
		saveSelectedSortFunction(sortFunctionHierachicalValue);
	};

	// TODO Comment
	var activateSortFunctionStyle = function(sortFunction) {
		// Remove active style
		$(".sortButton").each(function() { $(this).removeClass("active"); });

		// Mark active button
		$(".sortButton." + sortFunction).addClass("active");
	};

	// TODO Comment
	var getSelectedSortFunction = function(callback) {
		(new Request("Background", "Data", sortFunctionStorageKey, { Type: "get" })).Send(function(response) {
			callback(response) || function() {};
		});
	};

	// TODO Comment
	var saveSelectedSortFunction = function(sortFunction) {
		(new Request("Background", "Data", sortFunctionStorageKey, { Type: "set", Value: sortFunction })).Send();
	};
}

// Metadata for this plugin (VillageListEnhancement)
var VillageListEnhancementMetadata = {
	Name: "VillageListEnhancement",
	Alias: "Village List Enhancement",
	Category: "Utility",
	Version: "0.0.0.1",
	Description: "TODO",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		IsLoginRequired: true
	},

	Flags: {
		Alpha: true,
		Internal: true
	},

	Class: VillageListEnhancement
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, VillageListEnhancementMetadata);