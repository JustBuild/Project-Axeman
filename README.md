#Project Axeman
_Current version 0.2.1_

_Development version 0.2.1.0_


## Overview

Travian 4 extension that adds some "missing" features to the game.

_This extension uses [Google Chrome](http://www.google.com/chrome "Google Chrome web page") built-in capability to crawl and change page content using JavaScript. This extension isn't supported by Travian Games GmbH and is forbidden by [Travian Game rules and Terms of use](http://agb.traviangames.com/Travian_EN_Terms.pdf "Travian Terms of use (English)")! By using this extension and all features you agree with [License](https://github.com/JustBuild/Project-Axeman/blob/master/LICENSE.md "EULA on github")._


##Features

**Version 0.2 is finally here!**

- Support for up to 54 countries which means support for more than 200 servers
- Beautiful design that goes hand-in-hand with travian website
- Advanced Plugin system where you can enable or disable plugins as you need

**Available plugins**

- Warehouse na Granary capacity indicator
- Calculating fields, buildings and units cost is now fast and easy
- Fields upgrade indicator
- _And a lot more..._

**Plugins to come**

- Marketplace enhancements
- Village Selector 
- Easy Build
- Desktop notifications (tasks, units, messages, reports...)
- Website layout customization


## Development

Developed by JustBuild Development

- Aleksandar Toplek _([AleksandarDev](https://github.com/AleksandarDev "Aleksandar Toplek on github"))_

Collaborators

- Everton Moreth _([emoreth](https://github.com/emoreth "Everton Moreth on github"))_
- Ignacio Munizaga _([thagat](https://github.com/emoreth "Everton Moreth on github"))_
- kavillock _([kavillock](https://github.com/emoreth "Everton Moreth on github"))_


## Changelog

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
	- Merge pull request #2 from AleksandarDev/features … Features
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
	- GameLauncher is now functional …
		- Support for adding new profile
		- Support for lunching game tab page
		- Support for profile removal
	- Removed bug from last commit
	- Fixed problem when deleting profile …
		- Added Tribe to Profile model
		- Fixed checking UID on adding new profile, now checks server too
		- Fixed NewProfileTrive select element name changed to id
	- Changed plugins protocol …
		- Moved all files from Scripts/App/Plugins/* to
	- Plugins/<CATEGORY>/<PLUGIN_NAME>/*
		- Added GloablPluginsList to Plugins manager
		- Removed availablePlugins list
		- Now registering plugins from GlobalPluginsList
		- PluginsManagerPage.js changed to accept new protocol
		- Moved Images/Plugins/* to Plugins/<CATEGORY>/<PLUGIN_NAME>/Image.png
		- DevelopmentToolbar.js changed to accept new protocol
		- Feedback.js changed to accept new protocol
		- Added Services plugin in Core category
		- Added Files.html page that contains information about current state of coments in project, we need to comment all functions and classes usinf VSDoc standard
		- Minor changes
	- Added Alpha flag support in PluginsManager Page
	- Adding Services feature #1 …
		- Moved PluginImagePlaceholder to Images/
		- Added Alliance page to TravianPages array
		- Added loading to App.js (this currently loads only profiles)
		- Added server address, active profile and available profile variables
		- cursor:default on popup page item
	- Adding Services feature #2 …
		- Added Models.Report
		- Added Models.ReportCollection
		- Added CrawlReports function to Services.js
	- Adding Service feature #3 …
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