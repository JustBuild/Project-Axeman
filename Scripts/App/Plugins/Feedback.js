/******************************************************************************
 * Feedback.js
 * 
 * Author:
 * 		Aleksandar Toplek (AleksandarDev)
 *
 * Created on:
 * 		<08.06.2012.>
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
	 * Plugin header
	 *
	 *************************************************************************/
	this.PAli = "Feedback";
	this.PCat = "Support";			
	this.PImg = "Feedback.png";		
	this.PNam = "Feedback";			
	this.PVer = "0.1.0.0";			
	this.PDes = "Send us some feedback so we can quickly respond to any problems or ideas.";	
	this.PAut = "JustBuild Development";	
	this.PMIS = "https://github.com/JustBuild/Project-Axeman";	
	this.PFea = false;				
	this.PBet = true;				

	/**************************************************************************
	 *
	 * Registers Feedback plugin
	 *
	 *************************************************************************/
	this.Register = function () {
		// Insert feedback image
		$("#logo").after("<div style='margin:24px 31px 0 0;width:44px;height:33px;float:left;'><img id='PAFeedback' src='" + Helpers.GetImageURL("Plugins", "Feedback.png") + "' width='43px' height='43px' style='-webkit-filter:grayscale(1);' /></div>");

		// Remove spacer
		// TODO check if this  spacer means anything cause it has its own id maybe only for styling
		$("#myGameLinkHeaderWrapper").remove();

		// On mouse over/leave grayscale effect
		$("#PAFeedback").mouseenter(function () { $("#PAFeedback").attr("style", ""); }).mouseleave(function () { $("#PAFeedback").attr("style", "-webkit-filter:grayscale(1);"); });

		// Show popup on feedback image click
		$("#PAFeedback").click(function () {
			var popupWindow = window.open(Helpers.GetExtensionRootURL("Scripts/App/Plugins/FeedbackForm.html"), "name", "height=400, width=300");
			if(window.focus) {
				popupWindow.focus();
			}
		});
	};
}