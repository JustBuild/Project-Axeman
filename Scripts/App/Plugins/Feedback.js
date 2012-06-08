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
	this.Register = function() {
		
	}
}