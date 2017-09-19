# Changelog
All notable changes to this project will be documented in this file.

- **Version 0.2.9** _(03.08.2014.)_
	- New: Redesigned options page
	- Improved: Report Enahancements now features Report filters
	- Fix: Capital village was not saving correctly
- **Version 0.2.8** _(23.07.2014.)_
	- New: Support for troops in Resource Sender plugin
	- New: Resport Enhancement plugin
	- New: Decorations plugin
	- Fix: Extension was slowing down all websites
	- Fix: Upgrade Indicator didn't take crop in consideration
- **Version 0.2.7 & 0.2.6** _(14.07.2014.)_
	- New: Resource Sender plugin
	- New: Marketplace Enhancements plugin
	- Improved: User is now informed how to crawl capital city and village population
	- Improved: Number grouping in Resource Calculator plugin
	- Improved: Resource Calculator now shows time left when 00:00:00 
	- Improved: Resource Indicator now matches new T4.4 design	
	- Fix: User profiles were not saved properly
	- Fix: Capital now detected correctly
	- Fix: Submit button when creating new profile was hidden
	- Removed: Development Toolbar (internal) plugin
- **Version 0.2.5.1** _(11.07.2014.)_
	- New: Support for T4.4
	- Fix: Popup dialog was too small
	- Removed: Welcome screen
- **Version 0.2.5** _(10.09.2013.)_
	- New: Support for T4.2 servers
		- Support is partial and will improve in time. Please send us feedback so that we can fix misssed features quicker
	- Fix: [Travian Manager] Create button is unreachable
- **Version 0.2.4** _(28.02.2013.)_
	- Extension now runs on customizable url list
	- DevelopmentToolbar Console toggle button now saves state
	- Fix ResourceCalculator not updating on units
	- Added PageMayContain to PluginMetadata model which evaluates as 'or' operation
	- Added Decorations plugin (Fun category)
		- Added option to remove Help button from page
	- Added TravianPLUS plugin (Utility category)
		- Added 'Select all' option for reports and messages
	- Implemented internationalization
		- Added en (English)
		- Added hr (Hrvatski/Croatian)
	- PluginsManager
		- Added timed registration (&lt;20ms recommended)
	- Moved all pages to seperate directories
	- Popup redesign
		- Now supports auto-login
		- "Smart profile creation" 2-way profile creation
	- Removed unnecessary styles
	- Implemented functionality to Extension Activate/Deactivate button in Popup page
	- Seperated styles from code in UpgradeIndicator plugin
	- Popup translations complete for english
	- Fix UpgradeIndicator Optimization for fields
	- Fix UpgradeIndicator not showing corrently when there were no fields
	- Removed parseInt from ResourceIndicator
	- Fix MarketplaceEnhancements invalid select village options
	- Fix MarketplaceEnhancements Allowing to add more than in storage via shortcuts
	- DevelopmentToolbar new scrollbar style
	- Updated jQuery to 1.9.0

- **Version 0.2.3 (not released)** _(16.01.2013.)_
	- PluginsManager.html	
		- Moved to seperate directory
		- Seperated styles from html
		- Replaced PluginItem string generating to jQuery objects
		- Implemented Internal and featured flags (needs graphics)
		- Added "INTERNAL" text left of plugin alias
		- Functions moved to inner scope
	- Modal view 
		- Now under development toolbar
		- Style now matches development toolbar
		- Implemented pageslide as App modal view
	- Created Utils directory
		- Added pageslide jQuery plugin
		- Added underscore.js
	- Added NavigationManager application class
	- Google Analytics
		- Fix Google analytics now tracking in development mode
		- Fix Google analytics now called upon plugin registration rathet than script loading
		- Fix App.js Google Analytics
	- ResourceCalculator
		- Fix Now works for units again
		- Fix Layout for crop consumption
		- Optimized by removing timer in unit quantity change and replaced with event
	- Helpers
		- Added Query handling function
		- Added CreateStylesheet function
	- Added FiledNames to Enums
		- Fix Enums.FieldNames, Wood changed to Lumber
	- Fix Loging on Background page now working
	- PluginsManager
		- Moved Page and Query matching to PluginsManager
		- Added IsLoginRequired, RunOnPages, RunOnPageQuery variables to PluginMetadata model
		- Renamed Changeable to IsChangeable in PluginsMetadata model
		- Added PageMustContain to PluginMetadata.Settings model
	- ResourceCalculator
		- Fix ResourceCalculator duplicate issue
		- Fix ResourceCalaulator showing on troops send
	- MarketplaceEnhancements
		- Minor modifications to MarketplaceEnhancements plugin
		- Junk table
			- Added junk fill resource shortcuts
			- Fix Junk table issues	
			- Fix Junk table layout
		- Resource boxes
			- Refactored spin function
			- Added select text on focus
			- Added another event handle function that reacts on keypress
			- Fix Send error message now showing when needed on resource amount change
			- Fix Bug in spinner max value	
		- Village list
			- Village list select not shown if there is no villages to send resources to
			- Fix Village select now not showing current village
		- Seperated styles from code
		- Added support for multiple hour production clicks
		- Fix Plugin not runing on right page due to wrong query addressing
	- Removed duplicates
	- Updated jQuery to 1.9.0b1

- **Version 0.2.2.3** _(28.12.2012.)_
	- MarketplaceEnhancements
		- New plugin MarketplaceImprovements (Alpha, Internal)
		- MarketplaceImprovements renamed to MarketplaceEnhancements
	- Change jQueryUI CSS
		- Style reminiscent of a travian
		- Deafult loaded on all pages
	- PAStyle now default loaded on all pages (except extension pages)
	- Services
		- Fix CrawlVillageType.
	- Plugins Manager 
		- New style in development
		- Fixed some problems with toggling plugins
	- ResourceCalculator:
		- Add calculator to Academy and Hero page
		- Fix Less timers (more speed)
		- Fix Layout
	- Popup.html
		- Fix Profile population bug
		- Fix Profile delete removes all accounts bug
		- Fix page now has margin 0 instead of default
	- Helpers methods used to log now support categories


- **Version 0.2.2.2** _(25.11.2012.)_
	- Added Google Analytics


- **Version 0.2.2.1** _(25.11.2012.)_
	- PluginManager check deafult state of plugin, on first run
	- StorageDetais show data as table
	- Enums have all buildings
	- jQuery & jQueryUI update
	- FieldUpgradeIndicator is now UpgradeIndicator
		- Add VillageIn support
	- Services:
		- Crawl Villages Details
			- Check Main City
			- Crawl Village population
			- Crawl Village Position
		- Fix Crawl Population
	- UpgradeIndicator: FieldUpgradeIndicator take into account IsMainCity
	

- **Version 0.2.2** _(22.11.2012.)_
	- Minor fixes
	- Fix some typos
	- Delete old & unused elements
	- Services:
		- Crawl population
		- Crawl village type
	- format manifest.json to readable form
	- Rebuid Plugin manager
	- Plugin settings are extended from model
	- Add new settings: deafult value and changeable
	- ResourceIndicator:
		- Tell, if the negative crop production
		- Beautify indicator frame
	- ResourceCalculator:
		- You can't build when production is negative, or warehouse < cost
	- Fix FieldUpgradeIndicator:
		- Levels as rounded div's
		- Village type from profile
		- Fix problem with new fields "deafult: 0"	


- **Version 0.2.1.1** _(12.07.2012.)_
	- Fixed FieldUpgradeIndicator not showing marks on right position


- **Version 0.2.1.0** _(11.07.2012.)_
	- Added FieldUpgradeIndicator plugin
	- Minor fixes


- **Version 0.2.0.3** _(06.07.2012.)_
	- Disabled DevelopmentMode by default (_bug from last build_)


- **Version 0.2.0.2** _(06.07.2012.)_
	- Fixed ModelView not showinf problem


- **Version 0.2.0.1** _(05.07.2012.)_
	- Fixed resources production crawling (now from script) on almost every page
	- Optimized crawling villages list
	- Updated ResourceCalculator
	- Updated ResourceIndicator
	- Added "Feedback" text on top of feedback page
	- Updated BackgroundScript
	- BackgroundScript now supports Action category


- **Version 0.2.0.0** _(03.07.2012.)_
	- README and LICENSE file changes	
	- Merge pull request #2 from AleksandarDev/features  Features
	- Moved new contentscript file	
	- Soma minor changes	
	- Minor code changes	
	- Basic App layout	
	- App classes	
	- Added other scripts	
	- App ground	
	- Requests now working	
	- Updated jQuery	
	- Updated jQueryUI	
	- Fixed extension	
	- Plugin registration	
	- Fixed DevelopmentToolbar public definition name	
	- Merge branch 'feature-plugin-developmenttoolbar' into development	
	- Added Debug mode	
	- Merge branch 'development' into feature-plugin-developmenttoolbar	
	- Support for Debug log	
	- Merge branch 'feature-plugin-developmenttoolbar' into development	
	- Fixed DLog	
	- Fixed Notifications and Requests classes	
	- Changed Requests and Notifications to RequestManager and Notification Manager
	- Updated Development notes	
	- Added extension root URL helper methods	
	- GetImageURL and GetExtensionRootURL added to Helpers class	
	- Added basic controls but having problems with text foregroud color	
	- Merge branch 'feature-plugin-developmenttoolbar' into development	
	- DevelopmentToolbar changes	
	- Minor changes	
	- Added Popup.html	
	- Class implementation	
	- Implementing classes
	- Added PluginsManager and Header to plugins 
		- Coments are now max. 80c long
		- Plugins now must have header that contains image, name, version, description, author, more info site (github page), featured and beta flags
		- Added two variables ActivePage and ActivePageQuery and those are now filled with right information
	- Basic PluginManager plugin item working 
		- Added PluginManager.html page
	- PluginsManager now generating items 
		- Added one filed for plugins header "PAli" and it contains plugin names as is (file name without extension or class name)
	- Updating PluginsManager page 
		- Now only needs to pull enabled/disabled option from saved settings for each plugin item available
	- Added plugin category to header	
	- Working two way communication PluginsManager<->App
		- Only active plugins register
	- Fixed DevelopmentToolbar text color 
		- Now color draws correctly
		- Problem was hat plugin uses 'a' tag as button, label etc. and those are links and have different states http://www.w3schools.com/css/css_link.asp
	- DevelopmentMode only active when DevelopmentToolbar is active	
	- Added Feedback plugin	
	- Feedback now fully functional	
	- Added Game laucher page (popup page) 
		- Using browser action in manifest
		- Added popup page to development toolbar
	- ModalView in App
		- Fixed PluginItem table layout (width set to 100%)
		- Added ModalView in travian game page
	- Fixed ModalView on app.js
		- Now views are not shown using iframe
		- Downloads page and puts its source to modalview
	- Feedback Create message now opens in new window/tab
	- GameLauncher UI
	- Added StorageDetails page 
		- Added needed variables to Profile model
		- Models are now inside a Model namespace
		- Added StorageDetails link to DevelopmentToolbar
	- Fixed Models.Profile
	- GameLauncher is now functional 
		- Support for adding new profile
		- Support for lunching game tab page
		- Support for profile removal
	- Removed bug from last commit
	- Fixed problem when deleting profile 
		- Added Tribe to Profile model
		- Fixed checking UID on adding new profile, now checks server too
		- Fixed NewProfileTrive select element name changed to id
	- Changed plugins protocol 
		- Moved all files from Scripts/App/Plugins/* to
	- Plugins/&lt;CATEGORY&gt;/&lt;PLUGIN_NAME&gt;/*
		- Added GloablPluginsList to Plugins manager
		- Removed availablePlugins list
		- Now registering plugins from GlobalPluginsList
		- PluginsManagerPage.js changed to accept new protocol
		- Moved Images/Plugins/* to Plugins&lt;CATEGORY&gt;/&lt;PLUGIN_NAME&gt;/Image.png
		- DevelopmentToolbar.js changed to accept new protocol
		- Feedback.js changed to accept new protocol
		- Added Services plugin in Core category
		- Added Files.html page that contains information about current state of coments in project, we need to comment all functions and classes usinf VSDoc standard
		- Minor changes
	- Added Alpha flag support in PluginsManager Page
	- Adding Services feature #1 
		- Moved PluginImagePlaceholder to Images/
		- Added Alliance page to TravianPages array
		- Added loading to App.js (this currently loads only profiles)
		- Added server address, active profile and available profile variables
		- cursor:default on popup page item
	- Adding Services feature #2 
		- Added Models.Report
		- Added Models.ReportCollection
		- Added CrawlReports function to Services.js
	- Adding Service feature #3 
		- Now checking for user loged in
		- Crawling reports (PARTIAL)
		- Crawling messages (PARTIAL)
		- Crawling production
		- Crawling village list
		- Crawling loyalty
		- Crawling production
		- Crawling storage
		- Now automatically creating user profile on first login
		- Removed Helper namespace
		- Added IsNullOrEmpty function
		- Fixed some Background.js bugs
		- Added Tribes to Enums
		- GetExtensionRootURL renamed to GetURL
		- Models.VillageModel renamed to Models.Village
		- Added Models.MessageCollection
		- Added Models.Message
		- Added IsLogedIn to Variables.js
		- Added ActiveProfile to Variables.js
		- Added ActiveVillageIndex to Variables.js
		- Minor fixes
	- Added ResourceCalculator and ResourceIndicator
		- Added Welcome.html page
		- Activate Welcome.html page on first start in background script
		- Updated README.md


- **Version 0.1.7.0** _(01.09.2011.)_

	- Added: (Build) In build/upgrade page now there is time indication for each of resources 
	- Added: (Global) Desktop notifications support
	- Added: (Reports) PLUS Feature - Check all reports
	- Fixed: (Market) Sum of incoming resources now actually works
	- Fixed: (Global) Settings now loaded on the beginning and all options activated simultaneously


- **Version 0.1.6.1** _(24.08.2011.)_

	- Fixed: (Market) Sum of incoming resources now works again
	- Fixed: (SendTroops) Villages list now showing again
	- Fixed: (Global) Warehouse/Granary overflow now works fine
	- Fixed: (Extension) Extension not working on case sensitive operating systems _(e.g. Ubuntu)_


- **Version 0.1.6.0** _(21.08.2011.)_

	- Added: (Build) Resource difference now in Town Hall (celebrations)
	- Added: (Global) Internationalization support
	- Added: (Global) en language support
	- Added: (Global) hr language support
	- Fixed: (Global) Warehouse/Granary overflow timer now called only once in a second


- **Version 0.1.5.0** _(20.08.2011.)_

	- Added: (Build) Units cost difference
	- Fixed: (Global) Warehouse/Granary overflow now stops at 00:00:00
	- Fixed: (Global) Warehouse/Granary overflow now countdowns
	- Fixed: (Global) Warehouse/Granary overflow red color not showing
	- Fixed: (Global) Warehouse/Granary overflow now foreground color changes
	- Fixed: (Global) Warehouse/Granary overflow now counts for one instead for two
	- Removed: (Build) Unit cost calculated as buildings


- **Version 0.1.4.0** _(19.08.2011.)_

	- Added: (Market) Sum of incoming resources
	- Added: (Global) Warehouse/Granary overflow timeout
	- Added: (Global) Setting - Show sum of incoming resources
	- Added: (Global) Setting - Show Warehouse/Granary overflow timeout
	- Fixed: (Global) Initial settings now working well


- **Version 0.1.3.1** _(18.08.2011.)_

	- Added: (Global) Remove help link _(Stone and book, bottom left)_
		- _Disclaimer: On some servers this will remove only question mark and link_
	- Added: (Global) Setting - Remove in game help
	- Fixed: (Market) Market calls even if not in market
	- Fixed: (Global) Minor problems


- **Version 0.1.3.0** _(03.08.2011.)_

	- Added: (Market) Junk resource info
	- Added: (Global) LocalStorage for saving settings "options.html"
		- _Warning: HTML5 browser support needed for this to work!_
	- Added: (Global) Setting - My Village List in Marketplace
	- Added: (Global) Setting - My Village List in Send troops
	- Added: (Global) Setting - X2 resource shortcut
	- Added: (Global) Setting - Show junk resource


- **Version 0.1.2.0** _(01.08.2011.)_

	- Added: (Global) PageAction/"popup.html" which is visible only on Travian     pages
	- Added: (SendTroops) My villages list (combobox) in send troops page (a2b.php)
	- Fixed: (Market) My villages not shown when under attack
	- Removed: (Global) BrowserAction _(button on the right side of browser toolbox/addressbar)_


- **Version 0.1.1.0** _(03.07.2011.)_

	- Added: (Market) Sending resource shortcut X2


- **Version 0.1.0.0** _(02.07.2011.)_

	- First release
	- Added: (Global) BrowserAction/"popup.html" page added
	- Added: (Market) My villages list (combobox) in marketplace page
	- Added: (Market) Resources needed to build/upgrade buildings/troops
