# Project Axeman
_Current version 0.1.7_
_Development version 0.2.0.0_


## Overview

Travian 4 extension that adds some "missing" features to game.

_This extension uses [Google Chrome](http://www.google.com/chrome "Google Chrome web page") built-in capability to crawl and change page content using JavaScript. This extension isn't supported by Travian Games GmbH and is forbidden by [Travian Game rules and Terms of use](http://agb.traviangames.com/Travian_EN_Terms.pdf "Travian Terms of use (English)")! By using this extension and all features you agree with [License](https://github.com/JustBuild/Project-Axeman/blob/master/LICENSE.md "EULA on github")._


## Features

- Support for 52 countries
- Marketplace improvements 
    - 2X shortcut 
    - Junk resources
    - Incoming resource sum
    - Easy send resource to my village
- Warehouse and Granary full indicators
- Resource needed to build/upgrade buildings and units
- Settings page where you can customize extension
- Translations: _(to participate contact us justbuilddev@gmail.com)_
    - en _(English)_
    - hr _(Hrvatski)_
    - ptBR _Portuguese (Brazil)_ (version 0.1.7 only)
    - _Full list available [here](https://github.com/JustBuild/Project-Axeman/wiki/Internationalization "Project Axeman internationalization page")_

#### _Features to come_

- _Desktop notifications (new message, new report, warehouse/granary almost full, ...)_
- _Task queue (build, upgrade, demolish, send attack, ...)_
- _Troops Wave sender_
- _a lot more..._


## Development

Developed by JustBuild Development.

- Aleksandar Toplek _([AleksandarDev](https://github.com/AleksandarDev "Aleksandar Toplek on github"))_
    
Collaborator(s):
    
- Everton Moreth _([emoreth](https://github.com/emoreth "Everton Moreth on github"))_


## Changelog


- **Version 0.2.0** _(unknown)_

    - <div style="color:red;">Added: SessionStorage/LocalStorage option for sitted villages or players</div>
    - Added: Text box parallel to village selection box


- **Version 0.1.7** _(01.09.2011.)_

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


- **Version 0.1.6** _(21.08.2011.)_

    - Added: (Build) Resource difference now in Town Hall (celebrations)
    - Added: (Global) Internationalization support
    - Added: (Global) en language support
    - Added: (Global) hr language support
    - Fixed: (Global) Warehouse/Granary overflow timer now called only once in a second


- **Version 0.1.5** _(20.08.2011.)_

    - Added: (Build) Units cost difference
    - Fixed: (Global) Warehouse/Granary overflow now stops at 00:00:00
    - Fixed: (Global) Warehouse/Granary overflow now countdowns
    - Fixed: (Global) Warehouse/Granary overflow red color not showing
    - Fixed: (Global) Warehouse/Granary overflow now foreground color changes
    - Fixed: (Global) Warehouse/Granary overflow now counts for one instead for two
    - Removed: (Build) Unit cost calculated as buildings


- **Version 0.1.4** _(19.08.2011.)_

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


- **Version 0.1.3** _(03.08.2011.)_

    - Added: (Market) Junk resource info
    - Added: (Global) LocalStorage for saving settings "options.html"
        - _Warning: HTML5 browser support needed for this to work!_
    - Added: (Global) Setting - My Village List in Marketplace
    - Added: (Global) Setting - My Village List in Send troops
    - Added: (Global) Setting - X2 resource shortcut
    - Added: (Global) Setting - Show junk resource


- **Version 0.1.2** _(01.08.2011.)_

    - Added: (Global) PageAction/"popup.html" which is visible only on Travian     pages
    - Added: (SendTroops) My villages list (combobox) in send troops page (a2b.php)
    - Fixed: (Market) My villages not shown when under attack
    - Removed: (Global) BrowserAction _(button on the right side of browser toolbox/addressbar)_


- **Version 0.1.1** _(03.07.2011.)_

    - Added: (Market) Sending resource shortcut X2


- **Version 0.1.0** _(02.07.2011.)_

    - First release
    - Added: (Global) BrowserAction/"popup.html" page added
    - Added: (Market) My villages list (combobox) in marketplace page
    - Added: (Market) Resources needed to build/upgrade buildings/troops