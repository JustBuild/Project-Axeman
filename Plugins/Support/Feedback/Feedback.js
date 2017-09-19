/******************************************************************************
 * Feedback.js
 *
 * Author:
 * 		Aleksandar Toplek (AleksandarDev)
 *
 * Created on:
 * 		08.06.2012.
 *
 *****************************************************************************/

/// <summary>
/// Feedback plugin class
/// </summary>
function Feedback() {
  /// <summary>
  /// Registers Feedback plugin
  /// </summary>
  this.Register = function() {
    Log("Feedback: Registering Feedback plugin...");

    // Insert feedback image
    DLog("Feedback: Injecting link image...");

    var style = "margin:24px 31px 0 0;width:44px;height:33px;float:left;";
    if (ActivePageTravianVersion === "4.4") {
      style = "margin:21px 31px 0 130px;width:44px;height:33px;float:left;";
    }
    $("#logo").after(
      "<div style='" +
        style +
        "'><img id='PAFeedback' src='" +
        GetURL("Plugins/Support/Feedback/Image.png") +
        "' width='43px' height='43px' style='-webkit-filter:grayscale(1);' /></div>"
    );

    // Remove spacer
    // TODO check if this  spacer means anything cause it has its own id maybe only for styling
    //$("#myGameLinkHeaderWrapper").remove();

    // On mouse over/leave grayscale effect
    $("#PAFeedback").mouseenter(function() {
      $("#PAFeedback").css("-webkit-filter", "grayscale(0)");
    });
    $("#PAFeedback").mouseleave(function() {
      $("#PAFeedback").css("-webkit-filter", "grayscale(1)");
    });

    // Show popup on feedback image click
    $("#PAFeedback").click(function() {
      app.ShowModalView("Plugins/Support/Feedback/FeedbackForm.html");
    });
  };
}

// Metadata for this plugin (Feedback)
var FeedbackMetadata = {
  Name: "Feedback",
  Alias: "Feedback",
  Category: "Support",
  Version: "0.1.1.5",
  Description:
    "Send us some feedback so we can quickly respond to any problems or ideas.",
  Author: "JustBuild Development",
  Site: "https://github.com/JustBuild/Project-Axeman/wiki",

  Settings: {
    IsLoginRequired: true
  },

  Flags: {
    Beta: true
  },

  Class: Feedback
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(
  true,
  {},
  Models.PluginMetadata,
  FeedbackMetadata
);
