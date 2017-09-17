/******************************************************************************
 * MarketplaceEnhancements.js
 *
 * Author:
 * 		Grzegorz Witczak
 *
 * Collaborators:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		09.12.2012.
 *
 * ToDo:
 * 		It works
 * 		Documentation, log
 * 		and other
 *
 *****************************************************************************/

function MarketplaceEnhancements() {
	var tradersAvailable;
	var traderCarryAmount;

	this.Register = function() {
		/// <summary>
		/// Initializes plugin object
		/// </summary>

		Log("Registering MarketplaceEnhancements plugin...", "MarketplaceEnhancements");

		// Inserting stylesheet
		$("head").append(CreateStylesheet("Plugins/Utility/MarketplaceEnhancements/MarketplaceEnhancementsStyle.css"));

		// Gets max carry for one trader and number of traders available
		// TODO Move this to Services
		traderCarryAmount = $(".send_res .max:eq(0) > a").text() || 0;
		if (ActivePageTravianVersion === "4" || ActivePageTravianVersion == "4.2") {
			tradersAvailable = $("#merchantsAvailable").text() || 0;
		}
		else if (ActivePageTravianVersion === "4.4") {
			tradersAvailable = escape($(".merchantsAvailable").html()).split(/[A-Z]|%/)[4] || 0;
		}

		DLog("Trader Max Transport: " + traderCarryAmount, "MarketplaceEnhancements");
		DLog("Traders available: " + tradersAvailable, "MarketplaceEnhancements");


		// Add village selector if there are villages to send resources to
		if (ActiveProfile.Villages.length > 1) {
			FillVillagesList();
		}

		// Adds placeholder to village name textbox
		$("#enterVillageName").attr("placeholder", "Enter village name");

		// Add spinners to resources textboxes
		AddSpiners();

		// Add village hour production button
		// TODO Add second button that adds hour production from all villages
		AddHourProductionButton();
		AddFullButton();

		// Inserts junk resources table
		InsertJunkResourceTable();
		FillInJunkResourceTable();

		// Replace built-in shortcuts with custom
		AddTransportShortcuts();

		//Test Area ;)
		(function () {
			//Perhaps works, maybe not, but useful
			IncomingSum();
		})/*()*/;
	};

	var AddHourProductionButton = function() {
		var useHour = $("<span>").text("1h").attr({
			id: "PAMEHourProductionButton",
			title: "Use this village's hour production"
		}).css({
			margin: "0"
		}).button({
			icons: { primary: "ui-icon-plus" }
		}).click(function () {
			$.each($("#send_select input"), function (index, obj) {
				var production = ActiveProfile.Villages[ActiveVillageIndex].Resources.Production[index];
				$(obj).spinner("value", $(obj).spinner("value") + production);
				$(obj).change();
			});
		});

		ValidateHourButton();

		$("#send_select tr:eq(4) td").append(useHour);

		$("#r1, #r2, #r3, #r4").change(function () { ValidateHourButton(); });
		$("#r1, #r2, #r3, #r4").on("input", function () { ValidateHourButton(); });
	};

	var AddFullButton = function() {
		var fill = $("<span>").text("Full").attr({
			id: "PAMEFullButton",
			title: "Fill up your selected village",
		}).css({
			margin: "0"
		}).button({
			icons: { primary: "ui-icon-plus" }
		}).click(function () {

            var VillageIndex = document.getElementById('enterVillageName_list').value;
            var villageStorage = ActiveProfile.Villages[VillageIndex].Resources.Stored;
            var villageMaxStorage = ActiveProfile.Villages[VillageIndex].Resources.Storage;

						villageStorage = villageStorage.map(function (x) {
							return parseInt(x.replace(/\D/g, '').trim(), 10);
						});
						villageMaxStorage = villageMaxStorage.map(function (x) {
              return parseInt(x.replace(/\D/g, '').trim(), 10);
						});

            for (var i = 0; i < 4; i++) {
            	var id = 'r' + (i + 1);
				var store = (villageMaxStorage[i]) - (villageStorage[i]);
				console.log(villageMaxStorage, villageStorage, villageMaxStorage[i], (villageMaxStorage[i]), (villageStorage[i]), i);
                store = Math.floor((store - 100) / 10) * 10;

                $('#' + id).val(store);
            }

			$.each($("#send_select input"), function (index, obj) {
				$(obj).change();
			});
		});

		$("#send_select tr:eq(4) td").append(' ').append(fill);
	};

	var ValidateHourButton = function () {
		var hourButton = $("#PAMEHourProductionButton");
		hourButton.attr("title", "Add this village's hour production");
		hourButton.button("option", "disabled", false);

		var villageResources = ActiveProfile.Villages[ActiveVillageIndex].Resources;
		var productionSum = 0;

		// Chack if enough each resources is stored
		for (var index = 0; index < 4; index++) {
			var stored = villageResources.Stored[index];
			var production = villageResources.Production[index];
			var alreadySet = $("#r" + (index + 1)).spinner("value");
			if (stored < (production + alreadySet)) {
				DLog("Not enough " + Enums.FieldNames[index] + " stored [" + stored + "] to send " + (alreadySet ? "more than" : "hour production") + " [" + (production + alreadySet) + "]", "MarketplaceEnhancements");
				hourButton.button("option", "disabled", true);
				hourButton.attr("title", hourButton.attr("title") + "\nNot enough " + Enums.FieldNames[index] + " - " + (production + alreadySet - stored) + " more needed");
			}

			productionSum += production + alreadySet;
		}

		// Check if enough traders is available
		var canTransport = tradersAvailable * traderCarryAmount;
		if (canTransport < productionSum) {
			DLog("Not enough traders to send [" + productionSum + "] resources", "MarketplaceEnhancements");
			hourButton.button("option", "disabled", true);
			hourButton.attr("title", hourButton.attr("title") + "\nNot enough traders available - " + (Math.ceil(productionSum / traderCarryAmount) - tradersAvailable) + " more needed");
		}
	};

	var FillVillagesList = function () {
		/// <summary>
		/// Adds Select element under the village name textbox so that is
		/// simplifies sending resources to owned villages
		/// </summary>

		Log("Adding village list selector...", "MarketplaceEnhancements");

		// Build dropdown selector
		var selectInput = $("<select>").attr({
			'id': 'enterVillageName_list',
			'class': 'text village'
		});

		selectInput.append("<option disabled selected>Select a village</option>");

		// Gets village names to array
		var villages = [];
		for (var index = 0, cache = ActiveProfile.Villages.length; index < cache; index++) {
			var obj = ActiveProfile.Villages[index];

			// Check if village is not currently active village
			if (ActiveProfile.Villages[ActiveVillageIndex].VID != obj.VID) {
				selectInput.append("<option value="+index+">" + obj.Name + "</option>");
			}
		}

		// Append selector
		$(".compactInput").append($("<br>"));
		$(".compactInput").append(selectInput);

		// Change village needs to delete coords
		$(selectInput).change(function () {
			$("#enterVillageName").val($('option:selected', this).text());
			$("#xCoordInput, #yCoordInput").val("");
		});

		//Beautify it
		$("#enterVillageName").css("width", "175px");
		$("#enterVillageName_list").css("width", "100%");

		Log("Village list selector successfully added!", "MarketplaceEnhancements");
	};

	var AddSpiners = function() {
		/// <summary>
		/// Adds spinners to resource input textboxes
		/// </summary>
		/// <param name="tradersAvailable">Number of traders available</param>
		/// <param name="traderMaxTransport">Amount of resource each trader can carry</param>

		// Go through all resource input textboxes
		$("#r1, #r2, #r3, #r4").each(function (index, obj) {
			// Get stored amount of current resource
			var stored = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[index];

			// Apply spinner to current resource input textbox
			$(obj).spinner({
				incremental: true,
				step: 1,
				min: 0,
				max: stored,
				spin: function (event, ui) {
					console.warn(event);
					var spinStep = 1;
					var isInc = ui.value >= $(this).val();
					var stepValue = isInc ? 1 * spinStep : -1 * spinStep;

					// On spin up, if stored value is greater than trader carry, increase step to trader carry value (add one trader carry value)
					// On spin down, if spinner value is greater than trader carry, increase step to trader carry value (remove one trader carry value)
					if ((isInc && ui.value - 1 + traderCarryAmount <= stored) ||
						(!isInc && ui.value + 1 - traderCarryAmount >= 0)) {
						spinStep = traderCarryAmount;
					}

					$(this).spinner("value", ui.value + spinStep * stepValue - stepValue);
					$(event.target).change();
					return false;
				}
			}).click(function () {
				$(this).select();
			});
		});
	};

	var InsertJunkResourceTable = function () {
		/// <summary>
		/// Inserts JunkResource rows in the end of resource selection table
		/// </summary>

		Log("Inserting Junk resources table...", "MarketplaceEnhancements");

		// This will prevent error messages
		$(".send_res tbody tr:eq(5)").hide();

		var junkResourcesTable = $("<table>").addClass("PAMEJunkTable").attr({
			cellpadding: 1,
			cellspacing: 1
		});

		var merchantsRow = $("<tr>");
		merchantsRow.append($("<td>").attr("colspan", "2").append("Merchants"));
		merchantsRow.append($("<td>").addClass("tradersNeeded").append("0"));
		merchantsRow.append($("<td>").addClass("tradersAvailable").append("/ " + tradersAvailable));

		var currentRow = $("<tr>");
		currentRow.append($("<td>").attr("colspan", "2").append("Current"));
		currentRow.append($("<td>").addClass("currentLoaded").append("0"));
		currentRow.append($("<td>").addClass("maxRes").append("/ 0"));

		var wastedRow = $("<tr>");
		wastedRow.append($("<td>").attr("colspan", "2").append("Waste"));
		wastedRow.append($("<td>").addClass("junkAmount").append("0"));
		wastedRow.append($("<td>")
			.append($("<div>")
				.append($("<img>").addClass("r1 PAMEJunkTableResourceLink Disabled").attr({ src: "img/x.gif", title: "Add waste to Lumber" }).click(UseJunkResource))
				.append($("<img>").addClass("r2 PAMEJunkTableResourceLink Disabled").attr({ src: "img/x.gif", title: "Add waste to Clay" }).click(UseJunkResource))
				.append($("<img>").addClass("r3 PAMEJunkTableResourceLink Disabled").attr({ src: "img/x.gif", title: "Add waste to Iron" }).click(UseJunkResource))
				.append($("<img>").addClass("r4 PAMEJunkTableResourceLink Disabled").attr({ src: "img/x.gif", title: "Add waste to Crop" }).click(UseJunkResource))));

		junkResourcesTable.append(merchantsRow);
		junkResourcesTable.append(currentRow);
		junkResourcesTable.append(wastedRow);

		// Adds new row with column that is apend on whole outter table and insertst new table to that column
		$(".send_res tbody").append($("<tr>").append($("<td>").attr("colspan", "4").append(junkResourcesTable)));

		// For keyboard input
		$("#r1, #r2, #r3, #r4").on("input", function () {
			FillInJunkResourceTable();
		});

		$("#r1, #r2, #r3, #r4").change(function () {
			FillInJunkResourceTable();
		});

		Log("Junk resources table inserted successfully...", "MarketplaceEnhancements");
	};

	var UseJunkResource = function () {
		var obj = $(this);
		var objClass = obj.attr("class");

		// Check if shortcut is enabled
		if (obj.hasClass("Disabled")) {
			DLog("Shortcut isn't enabled [" + objClass + "]");
			return;
		}

		// Get spinner for given resource shortcut
		var targetResourceIndex = objClass[objClass.search(" r") + 2];
		var targetElement = $("#r" + targetResourceIndex);
		var resourceReserved = targetElement.spinner("value");

		var stored = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[targetResourceIndex - 1];
		var junkAmount = (parseInt($(".junkAmount").text(), 10) || 0);

		targetElement.spinner("value", resourceReserved + Math.min(junkAmount, stored - resourceReserved));
		targetElement.change();
	};

	var FillInJunkResourceTable = function () {
		/// <summary>
		/// Caltulates and fills values of pre-inserted table for junk resources
		/// </summary>

		var resMax = tradersAvailable * traderCarryAmount;

		// Get input values
		var r1 = $("#r1").spinner("value");
		var r2 = $("#r2").spinner("value");
		var r3 = $("#r3").spinner("value");
		var r4 = $("#r4").spinner("value");

		// Calulate sum of values
		var resSum = r1 + r2 + r3 + r4;

		// Calculates min number of traders needed for transport
		var tradersNeeded = Math.ceil(resSum / traderCarryAmount);

		// Calculates junk amount
		var junkAmount = tradersNeeded * traderCarryAmount - resSum;

		// Chane styles when use requested too many traders
		if (tradersNeeded > tradersAvailable)
			$(".tradersNeeded").parent().addClass("PAMEJunkTableErrorRow");
		else $(".tradersNeeded").parent().removeClass("PAMEJunkTableErrorRow");

		// Change style if user loaded more resources than travelers can carry
		if (resSum > resMax)
			$(".currentLoaded").parent().addClass("PAMEJunkTableErrorRow");
		else $(".currentLoaded").parent().removeClass("PAMEJunkTableErrorRow");

		// Disables all resource shortcuts so they can be enabled if available
		$(".PAMEJunkTableResourceLink").addClass("Disabled");

		// Change style if junk amount isn't zero
		if (junkAmount !== 0) {
			$(".junkAmount").parent().addClass("junkAmountNonzero");

			for (var index = 0; index < 4; index++) {
				var target = $("#r" + (index + 1));
				var resourceReserved = target.spinner("value");
				var stored = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[index];
				if (stored - resourceReserved > 0)
					$(".PAMEJunkTableResourceLink:eq(" + index + ")").removeClass("Disabled");
			}
		}
		else $(".junkAmount").parent().removeClass("junkAmountNonzero");

		// Changes value of pre-inserted rows
		$(".currentLoaded").text(resSum);
		$(".maxRes").text("/ " + resMax);
		$(".junkAmount").text("  " + junkAmount);
		$(".tradersNeeded").text(tradersNeeded);

		DLog("Traders [" + tradersAvailable + "] each (max. " + traderCarryAmount + ") sending [" + resSum + "] with total junk amount [" + junkAmount + "]", "MarketplaceEnhancements");
	};

	var AddTransportShortcuts = function() {
		// TODO Comment
		Log("Adding transport shortcuts...", "MarketplaceEnhancements");

		// Hide Travian shortcuts
		$("[id*='addRessourcesLink']").hide();

		// 1x shortcut
		for (var index = 0; index < 4; index++) {
			var container = $(".send_res > tbody > tr:eq(" + index + ") > .max");

			var shortcutElement = $("<a>")
				.attr("href", "#")
				.addClass("PAMEShortcut")
				.data("amount", traderCarryAmount)
				.data("resource", index)
				.click(function () {
					if (!$(this).hasClass("disabled")) {
						var inputElement = $(".val input", $(this).parent().parent());
						var inputValue = inputElement.spinner("value");
						inputElement.spinner("value", inputValue + traderCarryAmount);
						inputElement.change();
					}
				}).text(traderCarryAmount);

			container.append(shortcutElement);
		}

		// Validate shortcuts on input change
		$("#r1, #r2, #r3, #r4").change(ValidateTransportShortcuts);

		Log("Transport shortcuts added successfully!", "MarketplaceEnhancements");
	};

	var ValidateTransportShortcuts = function () {
		// TODO Comment

		var inputElement = $(this);
		var currentAmount = inputElement.spinner("value");
		var shortcuts = $(".PAMEShortcut", inputElement.parent().parent().parent());

		$.each(shortcuts, function() {
			var element = $(this);
			if (currentAmount >= inputElement.spinner("option", "max")) {
				element.addClass("disabled");
			} else element.removeClass("disabled");
		});
	};


	var IncomingSum = function() {
		// TODO Comment
		Log("Generating table for incoming resources sum...", "MarketplaceEnhancements");

		// TODO Move this to Services
		var CrawlMarketplaceTables = function() {
			// Get groups(types) of trades incomming/outgoing
			var groups = $("#merchantsOnTheWayFormular h4").length;
			var arrivingTables = undefined;

			if (groups === 2) {
				// First group is arriving merchants
				arrivingTables = $("#merchantsOnTheWayFormular h4:first:first-of-type").nextUntil("h4");
			} else if (groups === 1) {
				//if  traders available=total traders
				//    incoming=true
				//else
				//    check language options
				//    NOTE Check class "none" under tbody > .res, those are not incoming
				//    NOTE Check sender UID, if same as active profile, those are outgoing
			}

			// Check if there is any arriving tables
			if (!arrivingTables) {
				DLog("No arriving merchants.", "MarketplaceEnhancements");
				return;
			}

			var resourceSum = [0, 0, 0, 0];
			var maxTime = Number.MAX_VALUE;
			var arrivingIndex = 0;
			// Get max time
			$(".in", arrivingTables).each(function(index) {
				var timeSplit = $(this).text().split(":");
				var time = timeSplit[0] * 3600 + timeSplit[1] * 60 + timeSplit[2];

				if (time > maxTime) {
					maxTime = time;
					arrivingIndex = index;
				}
			});

			// Get resource sum by splitting all resource strings and adding them to array by
			// index mod 4 and offset by 1 because split returns unused value (first)
			var resourceSplit = $(".res > td > span", arrivingTables).text().split(" ");
			for (var index = 1, cache = resourceSplit.length; index < cache; index++) {
				resourceSum[(index - 1) % 4] += Number($.trim(resourceSplit[index]));
			}
		};
		CrawlMarketplaceTables();

		//save language info for later ;)

		//$("#merchantsOnTheWayFormular h4").each(function (index, obj) {
		//	$(this).nextUntil("h4").append("<p>'" + $(this).text().trim() + "'</p>");
		//});

		//This way not work, but it might be helpy

		//$(".traders").each(function(index) {
		//	var bodys = $(this).children("tbody");
		//	if (bodys.length === 2) {
		//		alert("mam cie");
		//		// Gets max time and timer name
		//		var timeSpan = $(bodys[0].children).children("td").children("div:first").children();
		//		var time = timeSpan.text();
		//		var timeSplit = time.split(":");
		//		var timeInteger = timeSplit[0] * 3600 + timeSplit[1] * 60 + timeSplit[2] * 1;

		//		if (timeInteger > maxTime) {
		//			maxTime = timeInteger;
		//			tableIndex = index;
		//			count++;
		//		}

		//		// Gets resources and sums it to total
		//		var res = $(bodys[1].children).children("td").children().text();
		//		var resSplit = res.split(" ");

		//		for (var i = 0; i < 4; ++i) {
		//			sum[i] += parseInt(resSplit[i + 1], 10);
		//		}
		//	}
		//});

		// Checks if any incoming trade exists
		//if (count > 0) {
		//	// Recreate table with custom text
		//	var sourceTable = $(".traders:eq(" + tableIndex + ")");

		//	var customTable = $(sourceTable.outerHTML());

		//	// Head customization
		//	customTable.children("thead").children().children().each(function(index) {
		//		if (index === 0) $(this).html(_gim("TravianTotalIncoming"));
		//		else $(this).html(_gim("TravianIncomingFrom") + " " + count + " " + _gim("TravianVillagesLC"));
		//	});

		//	customTable.children("tbody:first").children().children("td").children(".in").children().attr("id", "paIncomingSumTimer");

		//	// Resource customization
		//	customTable.children("tbody:last").children().children("td").children().html(
		//		"<img class='r1' src='img/x.gif' alt='wood'> " + sum[0] + "&nbsp;&nbsp;" +
		//			"<img class='r2' src='img/x.gif' alt='clay'> " + sum[1] + "&nbsp;&nbsp;" +
		//			"<img class='r3' src='img/x.gif' alt='iron'> " + sum[2] + "&nbsp;&nbsp;" +
		//			"<img class='r4' src='img/x.gif' alt='crop'> " + sum[3] + "&nbsp;&nbsp;"
		//	);

		//	Log("buildMarketIncomingSum - Table generated! Appending table to beginning...");

		//	// Appends custom table to beginning
		//	$(".traders:first").before(customTable.outerHTML());

		//	Log("buildMarketIncomingSum - Table appended successfully! Asigning timer...");

		//	// Updates incoming left time every 128 ms to original table value
		//	setInterval(function() {
		//		$("#paIncomingSumTimer").text(
		//			sourceTable.children("tbody:first").children().children("td").children(".in").children().text());
		//	}, 1000);
		//}


		Log("Incoming resources sum shown", "MarketplaceEnhancements");
	};
}

// Metadata for this plugin (MarketplaceImprovement)
var MarketplaceEnhancementsMetadata = {
	Name: "MarketplaceEnhancements",
	Alias: "Marketplace Enhancements",
	Category: "Utility",
	Version: "0.1.0.0",
	Description: "Adds number of improvements to the marketplace, quick village selection, resource shortcuts, junk resource links and many more.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		IsLoginRequired: true,
		RunOnPages: [Enums.TravianPages.Build],
		PageMustContain: [".gid17 a[id^=addRessourcesLink]"]
	},

	Flags: {
		Beta: true
	},

	Class: MarketplaceEnhancements
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, MarketplaceEnhancementsMetadata);
