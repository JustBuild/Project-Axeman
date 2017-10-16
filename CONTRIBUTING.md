## RELEASE TODO LIST
	(1)		Variables.js > IsDevelopmentMode => false
	(2)		Variables.js > IsDebugMode => false
	(3)		Changes log


## LIBRARIES USED
	jQuery current version:		1.11.1
	jQueryUI current version:	1.9.1
	jQuery.pageslide			2.0 + <head> fix

	knockout.js					3.1.0


## APPLICATION DIAGRAM 
Available at https://cacoo.com/diagrams/KjPQ0pHQGjoujRxt


## USING AND LAUNCHING APP
For using plugins you need to include following scripts:

		Total: (8)
		(in that order)

		Scripts/App/Enums.js
		Scripts/App/Models.js
		Scripts/App/Variables.js
		Scripts/App/Helpers.js
		
		Scripts/App/RequestManager.js
		Scripts/App/NotificationManager.js
		Scripts/App/NavigationManager.js
		Scripts/App/PluginsManager.js

		<PLUGINS GO HERE>


To launch app include all above stated scripts plus two: 

		(in that order)
		
		Scripts/App/App.js
		Scripts/App/AppLauncher.js

## AVAILABLE PLUGINS
To add new plugin, you need to specify name and location of plugin script
on two places. On place is in manifest.json, you need to put your script 
filename including path to list of extension scripts and in PluginManager.html
page (and here below).

	Total: (13)

	Services				(Plugins/Core/Services/Services.js)
	Decorations				(Plugins/Fun/Decorations/Decorations.js)
	Feedback				(Plugins/Support/Feedback/Feedback.js)
	ResourceCalculator		(Plugins/Economy/ResourceCalculator/ResourceCalculator.js)
	ResourceIndicator		(Plugins/Economy/ResourceIndicator/ResourceIndicator.js)
	UpgradeIndicator		(Plugins/Economy/UpgradeIndicator/UpgradeIndicator.js)
	ResourceSender			(Plugins/Economy/ResourceSender/ResourceSender.js)
	VillageListEnhancement	(Plugins/Utility/VillageListEnhancement/VillageListEnhancement.js)
	MarketplaceEnhancements	(Plugins/Utility/MarketplaceEnhancements/MarketplaceEnhancements.js)
	AutoAdventure			(Plugins/Utility/AutoAdventure/AutoAdventure.js)
	ReportEnhancement		(Plugins/Utility/ReportEnhancement/ReportEnhancement.js)
	TravianPLUS				(Plugins/Utility/TravianPLUS/TravianPLUS.js)
	_Development			(Plugins/Development/_Development/_Development.js)