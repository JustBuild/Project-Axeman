/******************************************************************************
 * ResourceSender.js
 *
 * Author:
 * 		Aleksandar Toplek
 *
 * Collaborator:
 *		Geczy
 *
 * Donator:
 *		Geczy
 *
 * Created on:
 * 		11.07.2014.
 *
 *****************************************************************************/

function ResourceSender() {
  /// <summary>
  /// Initializes object
  /// </summary>
  this.Register = function() {
    Log("Registering ResourceSender plugin...", "ResourceSender");

    // If in marketplace at Send resource tab
    if ($("#content .container.active a[href*='t=5']").length) {
      HandleMarketplaceRequest();
    }

    // Process all show costs containers
    if (ActiveProfile.Villages.length > 1) {
      BuildingsSender();
    }
  };

  var BuildingsSender = function() {
    Log("In build page. Building UI...", "ResourceSender");

    $(".showCosts").each(function(index) {
      var container = $(this);

      // Check if there is any negative costs in current container

      DLog("Creating UI elements for cost block", "ResourceSender");

      // Retrieve costs
      var rx = GetBlockResourceDifference(index);

      DLog(
        "Got costs: " + rx[0] + ", " + rx[1] + ", " + rx[2] + ", " + rx[3],
        "ResourceSender"
      );

      // Build block UI
      var block = $("<div>")
        .addClass("ResourceSenderBlock")
        .data("blockindex", index);
      block.append(
        "<br/><div>You can send missing resources from another village:</div>"
      );
      FillVillagesList(block, container);
      AddSendButton(block, index, "Send from this village", rx);
      if ($("[class*='ResourceCalculatorR']", container).length) {
        AttachInputChangeWatcher(
          $("input[name*='t']", container.parent()),
          index
        );
      }
      block.append("<br/><br/>");

      // Append block to container
      container.append(block);

      // Determine whether this block need to be shown to user
      if (
        $(".ResourceCalculatorBuildCost.negative", container).length &&
        !$(".ResourceCalculatorBuildCost.upgradeStorage", container).length
      ) {
        block.show();
      } else {
        block.hide();
      }
    });
  };

  var AttachInputChangeWatcher = function(input, index) {
    $(input).on("input", function() {
      DLog("Input (" + index + ") changed...", "ResourceSender");

      var container = $(".showCosts:eq(" + index + ")");
      if ($(".ResourceCalculatorBuildCost.negative", container).length) {
        DLog("Showing troops block", "ResourceSender");

        var rx = GetBlockResourceDifference(index);
        DLog(
          "Got costs: " + rx[0] + ", " + rx[1] + ", " + rx[2] + ", " + rx[3],
          "ResourceSender"
        );

        UpdateSendButton(index, rx);

        $(".ResourceSenderBlock", container).show();
        $(".ResourceSendVillageNameList", container).change();
      } else {
        DLog("Hidding troops block", "ResourceSender");

        $(".ResourceSenderBlock", container).hide();
      }
    });
  };

  var GetBlockResourceDifference = function(index) {
    var resources = [];
    var container = $(".showCosts:eq(" + index + ")");
    var costs = $(".ResourceCalculatorBuildCost", container);

    for (var i = 0; i < 4; i++) {
      resources[i] =
        Math.floor(
          parseInt(
            $(costs[i])
              .text()
              .replace("(", "")
              .replace(",", ""),
            10
          ) / 10
        ) * 10 || 0;
    }

    return resources;
  };

  var HandleMarketplaceRequest = function() {
    Log("In marketplace on Send resources tab. Checking for send request...");

    var query = ParseQuery(ActivePageQuery);
    var resourceDestination = query.resourceDestinationId;
    var resourceValues = query.resourceSend;
    if (!resourceDestination || !resourceValues) {
      Log("No valid resource send request.", "ResourceSender");
      return;
    }

    // Retrieve destination name
    DLog("Retrieving destination village name...", "ResourceSender");
    var destinationName = "unknown";
    for (
      var index = 0, cache = ActiveProfile.Villages.length;
      index < cache;
      index++
    ) {
      if (ActiveProfile.Villages[index].VID == resourceDestination) {
        destinationName = ActiveProfile.Villages[index].Name;
      }
    }
    DLog("Destination village name: " + destinationName, "ResourceSender");

    // Append resource values to textboxes
    DLog("Appending send resource value...");
    var values = resourceValues.split(",");
    $("#send_select input[id*='r']").each(function(index) {
      $(this).val(values[index].replace("-", ""));
    });

    // Append destination name to village name textbox
    $("#enterVillageName").val(destinationName);

    Log("Send request processed.");
  };

  var GetMarketplaceLink = function(
    villageId,
    receiverVillageId,
    amounts,
    canSend
  ) {
    return !canSend
      ? "#"
      : "http://" +
          ActiveServerAddress +
          Enums.TravianPages.Build +
          "?gid=17&t=5&newdid=" +
          villageId +
          "&resourceDestinationId=" +
          receiverVillageId +
          "&resourceSend=" +
          amounts[0] +
          "," +
          amounts[1] +
          "," +
          amounts[2] +
          "," +
          amounts[3];
  };

  var UpdateSendButton = function(blockIndex, amounts) {
    DLog("Updating button (" + blockIndex + ") data", "ResourceSender");

    var button = $("#ResourceSendSendButton" + blockIndex);
    for (var i = 0; i < amounts.length; i++) {
      button.data("r" + (i + 1), amounts[i]);
    }
  };

  var AddSendButton = function(container, blockIndex, text, amounts) {
    /// <summary>
    /// Adds a travian like button with given link and text
    /// </summary>

    var button = $("<a>")
      .attr({
        id: "ResourceSendSendButton" + blockIndex,
        class: "ResourceSendSendButton",
        href: "#"
      })
      .css({
        "margin-left": "12px",
        display: "none"
      })
      .html(text);
    container.append(button);
  };

  var FillVillagesList = function(block, container) {
    /// <summary>
    /// Adds Select element under the village name textbox so that is
    /// simplifies sending resources to owned villages
    /// </summary>

    Log("Adding village list selector...", "ResourceSender");

    // Gets village names to array
    var villages = [];
    for (
      var index = 0, cache = ActiveProfile.Villages.length;
      index < cache;
      index++
    ) {
      var obj = ActiveProfile.Villages[index];

      // Check if village is not currently active village
      if (ActiveProfile.Villages[ActiveVillageIndex].VID != obj.VID)
        villages[villages.length] = obj;
    }

    // Build dropdown selector
    var index = $(".ResourceSendVillageNameList").length;
    var selectInput = $("<select>")
      .attr({
        id: "ResourceSendVillageNameList" + index,
        class: "ResourceSendVillageNameList"
      })
      .css({
        width: "40%"
      });

    // TODO Localize
    selectInput.append("<option disabled selected>Select a village</option>");

    var amounts = [];
    for (var i = 0; i < 4; i++) {
      amounts[i] = container
        .parent()
        .find("span.resources.r" + (i + 1) + " > div:first")
        .text()
        .replace(",", "")
        .replace("(", "")
        .replace(")", "");
      if (amounts[i] > 0) {
        amounts[i] = 0;
      }

      amounts[i] = Math.ceil(Math.abs(amounts[i]) / 10) * 10;
    }

    // Add village names to list
    $.each(villages, function(current, value) {
      var canSend = true;
      var sendFrom = false;

      for (
        var index = 0, cache = ActiveProfile.Villages.length;
        index < cache;
        index++
      ) {
        if (ActiveProfile.Villages[index].VID == value.VID) {
          sendFrom = ActiveProfile.Villages[index].Resources;
        }
      }

      for (var i = 0; i < amounts.length; i++) {
        // Check if vill even has this amount
        if (amounts[i] != 0 && sendFrom.Stored[i] < amounts[i]) {
          canSend = false;
          break;
        }
      }

      var htmlClass = !canSend
        ? 'style="color: #B20C08"'
        : 'style="color: #0C9E21"';
      selectInput.append(
        "<option data-villageId='" +
          value.VID +
          "' " +
          htmlClass +
          ">" +
          value.Name +
          "</option>"
      );
    });

    // Update link if selection changes
    $(selectInput).change(function() {
      DLog("Village selection changed", "ResourceSender");

      var option = $("option:selected", $(this));
      var canSend =
        option.css("color") == "#B20C08" ||
        option.css("color") == "rgb(12, 158, 33)";
      var selectedVillageId = option.data("villageid");
      if (!selectedVillageId) return;

      var selectedVillageSendLink = GetMarketplaceLink(
        selectedVillageId,
        ActiveProfile.Villages[ActiveVillageIndex].VID,
        amounts,
        canSend
      );
      var sendButton = $(this)
        .parent()
        .find("a.ResourceSendSendButton");
      sendButton.attr("href", selectedVillageSendLink);
      sendButton.text(
        selectedVillageSendLink == "#"
          ? "Not enough resources in village"
          : "Send from this village"
      );
      sendButton.css({
        color: selectedVillageSendLink == "#" ? "#B20C08" : "#99C01A",
        "font-weight": selectedVillageSendLink == "#" ? "normal" : "bold"
      });
      sendButton.show();
    });

    // Append selector
    block.append(selectInput);

    Log("Village list selector successfully added!", "ResourceSender");
  };
}

// Metadata for this plugin (Development)
var DevelopmentMetadata = {
  Name: "ResourceSender",
  Alias: "Resource Sender",
  Category: "Economy",
  Version: "0.1.0.1",
  Description: "Sends missing resource amount from any village shortcut",
  Author: "JustBuild Development",
  Site: "https://github.com/JustBuild/Project-Axeman/wiki",

  Settings: {
    RunOnPages: [Enums.TravianPages.Build],
    IsLoginRequired: true
  },

  Flags: {
    Beta: true
  },

  Class: ResourceSender
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(
  true,
  {},
  Models.PluginMetadata,
  DevelopmentMetadata
);
