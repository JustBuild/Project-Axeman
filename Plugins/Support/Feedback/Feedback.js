/******************************************************************************
 * Feedback.js
 * 
 * Author:
 * 		Aleksandar Toplek (AleksandarDev)
 *
 * Created on:
 * 		08.06.2012.
 *
 * Notes:
 *			This plugin allows user to send feedback for Project Axeman 
 *		extension since it's still in beta faze.
 *
 *****************************************************************************/

/******************************************************************************
 *
 * Feedback
 *
 *****************************************************************************/
function Feedback() {
	/**************************************************************************
	 *
	 * Registers Feedback plugin
	 *
	 *************************************************************************/
	this.Register = function () {
		if (!IsLogedIn) {
			Log("Feedback: User isn't loged in...");
			return;
		}

		Log("Feedback: Registering Feedback plugin...");

		// Insert feedback image
		DLog("Feedback: Injecting link image...");
		$("#logo").after("<div style='margin:24px 31px 0 0;width:44px;height:33px;float:left;'><img id='PAFeedback' src='" + GetURL("Plugins/Support/Feedback/Image.png") + "' width='43px' height='43px' style='-webkit-filter:grayscale(1);' /></div>");

		// Remove spacer
		// TODO check if this  spacer means anything cause it has its own id maybe only for styling
		$("#myGameLinkHeaderWrapper").remove();

		// On mouse over/leave grayscale effect
		$("#PAFeedback").mouseenter(function () { $("#PAFeedback").attr("style", ""); }).mouseleave(function () { $("#PAFeedback").attr("style", "-webkit-filter:grayscale(1);"); });

		// Show popup on feedback image click
		$("#PAFeedback").click(function () {
			$.get(GetURL("Plugins/Support/Feedback/FeedbackForm.html"), function (response) {
				(new App()).ShowModalView(response);
			});
		});
	};
}

// Metadata for this plugin (Feedback)
var FeedbackMetadata = {
	Name: "Feedback",
	Alias: "Feedback",
	Category: "Support",
	Version: "0.1.1.1",
	Description: "Send us some feedback so we can quickly respond to any problems or ideas.",
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

	Class: Feedback
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = FeedbackMetadata;