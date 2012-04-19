/*

    ContentScript.json

    by
    Aleksandar Toplek,
    JustBuild 2011.

    Collaborator
    Everton Moreth

    License at LICENSE.md file distributed with this file.

*/

// TODO: Performance - Retrieve only needed settings
// TODO: Save village by id not by name (you can find id on the villages list)
// TODO: Implement MVC model
// TODO: Sitter - Villages save to session storage rather than to localStorage

//
// Global variables
//
//
// Bot variables
var loadBotData = true;

// Debugging variables
var dev = true;
var dbgtmrs = false;

// Other variables
var dataLoaded = 0;
var dataAvailable = 14;
if(!loadBotData){
    dataAvailable--;
}
var startTime = 0;
var timerStep = 128;

// Settings
var checkGlobalRemoveInGameHelp;
var checkGlobalStorageOverflowTimeout;
var checkBuildBuildingResourceDifference;
var checkBuildUnitResourceDifference;
var checkMarketShowX2Shortcut;
var checkMarketListMyVillages;
var checkMarketShowJunkResource;
var checkMarketShowSumIncomingResources;
var checkSendTroopsListMyVillages;
var checkReportShowCheckAll;
var colorBuildableFields;
var botActivated;

// Village info
var village;

// bot info
var botData;
var bot;

//
// Global constants
//

// Initialization of extension script (travian page modification)
init();

/**
 * Initializes all extension functions
 *
 * @author Aleksandar Toplek
 */
function init() {
    devLog("init - Initializing...");
    startTime = (new Date()).getTime();

    devLog("init - Waiting for settings (0/" + dataAvailable + ")");

    if (dev) {
        var style = '<style type="text/css">' +
                    '    #DevBar {' +
                    '        position:fixed;' +
                    '        bottom: 0px; right: 0px; left: 0px;' +
                    '        padding: 5px;' +
                    '        background: -webkit-gradient(linear, left top, left bottom, from(#D3D3D3), to(#919191));' +
                    '    }' +
                    '    #DevButton {' +
                    '        color: lightgray;' +
                    '        background: -webkit-gradient(linear, left top, left bottom, from(#747474), to(#4B4B4B));' +
                    '        padding: 2px 8px 2px 8px;' +
                    '        border-radius: 10px;' +
                    '    }' +
                    '    #DevInfoText {' +
                    '        position:absolute; left: auto; right: 8px;' +
                    '        color: gray;' +
                    '    }' +
                    '</style>';
        $("head").append(style);
        $("body").append('<div id="DevBar" class="devbar"><b>&nbsp;Project Axeman DEV mode&nbsp;&nbsp;&nbsp;&nbsp;</b></div>');

        // Injects link to Debug page (only in dev mode)
        $(".devbar").append('<a id="DevButton" target="_blank" href="chrome-extension://' + extensionId + '/Pages/Debug/DebugPage.html">Debug info</a>&nbsp;&nbsp;&nbsp;&nbsp;');

        // Injects link to Options page (only in dev mode)
        $(".devbar").append('<a id="DevButton" target="_blank" href="chrome-extension://' + extensionId + '/Pages/Options.html">Options page</a>&nbsp;&nbsp;&nbsp;&nbsp;');

        $(".devbar").append('<a id="DevInfoText" href="#" class="infotextTime">Script time: ### ms</a>');
    }

    // Begins to load settings
    pageLoadData();

    // Calls for PageAction show
    _sendExtensionProcessRequest("ShowActionPage");
}

/**
 * Initializing page actions
 * Last used function
 *
 * @author Aleksandar Toplek
 */
function initPages() {
    var info = pageGetInfo();

    if (info.pathname !== "/login.php" &&
        info.pathname !== "/logout.php" &&
        info.pathname !== "/") {
        pageProcessAll(info);
    }

    devLog("initPages Checking orders");
    var order;
    if (bot.orders.length > 0){
        order = bot.getOrder();
        debugger;
    }

    // All finished, saving data
    //bot.resetOrders();
    saveData();

    var endTime = (new Date()).getTime();
    if (dev) {
        $(".infotextTime").text("Script time: " + (endTime - startTime) + " ms");
        devLog("initPages - Finished successfully! (" + (endTime - startTime) + ")");
    }

    // if there is an order execute it
    if (order){
        debugger
        order();
    }
}

function saveData() {
    devLog("saveData - Saving started...");

    _sendDataSetRequest("village" + village.uid, JSON.stringify(village));

    bot.saveData();

    devLog("saveData - All requests sent!");
}

/**
 * Requests for all settings to load
 *
 * @author Aleksandar Toplek
 */
function pageLoadData() {
    devLog("pageLoadSettings - dev[" + dev + "]");
    devLog("pageLoadSettings - dbgtmrs[" + dbgtmrs + "]");
    devLog("pageLoadSettings - [" + dataAvailable + "] settings available");

    requestData("Data", "checkGlobalRemoveInGameHelp");
    requestData("Data", "checkGlobalStorageOverflowTimeout");
    requestData("Data", "checkBuildBuildingResourceDifference");
    requestData("Data", "checkBuildUnitResourceDifference");
    requestData("Data", "checkMarketShowX2Shortcut");
    requestData("Data", "checkMarketListMyVillages");
    requestData("Data", "checkMarketShowJunkResource");
    requestData("Data", "checkMarketShowSumIncomingResources");
    requestData("Data", "checkSendTroopsListMyVillages");
    requestData("Data", "checkReportShowCheckAll");
    requestData("Data", "colorBuildableFields");
    requestData("Data", "botActivated");

    var activeVillageUId = globalGetActiveVillageUniversalIdentifier();
    requestData("Data", "village" + activeVillageUId, "village");
    if (loadBotData){
        requestData("Data", "botData" + activeVillageUId, "botData");
    }
}

function pageLoadVillageData() {
    if (true || village === "null") {
        village = new Village();
        village.name = globalGetActiveVillageName();
        village.uid = globalGetActiveVillageUniversalIdentifier();
    }
    else village = JSON.parse(village);

    devLog("pageLoadVillageData - Village loaded [" + village.name + "]");
    devLog(village);
}

function pageLoadBotData() {
    if (!loadBotData  || String(botData) === "null") {
        botData = {
            orders: [],
            active: false
        };
    }
    else botData = JSON.parse(botData);

    bot = new Bot(botData);

    devLog("pageLoadBotData - Bot loaded");
    devLog(bot);
}

/**
 * Gets setting and sets it to variable
 *
 * @author Aleksandar Toplek
 *
 * @param {String} _settingName Name of setting to retrieve
 */
function requestData(_category, _settingName, _variableName) {
    _sendDataGetRequest(_settingName, function (response) {
        dataLoaded++;
        eval((_variableName || _settingName) + " = '" + response + "';");

        devLog("requestData - Waiting for data (" + dataLoaded + "/" + dataAvailable + ")");
        if (dataLoaded === dataAvailable) {
            initPages();
        }
    });
}

/**
 * Pathname of current page.
 *
 * @author Aleksandar Toplek
 *
 * @return {Object} Returns an object with 'pathname' and 'search' properties.
 */
function pageGetInfo() {
    devLog("pageGetPathname - Reading current page...");

    var currentPath = window.location.pathname;
    var currentSeach = window.location.search;

    devLog("pageGetInfo - Current page pathname [" + currentPath + "]");
    devLog("pageGetInfo - Current page search [" + currentSeach + "]");

    return {
        pathname: currentPath,
        search: currentSeach
    };
}

/**
 * Runs all scripts that changes page content.
 * This should be called after all information is retrieved from page.
 *
 * @author Aleksandar Toplek
 *
 * @param {String} info Info of current page
 */
function pageProcessAll(info) {
    devLog("pageProcessAll - Starting...");

    var where = pageGetWhere(info.pathname);
    devLog("pageProcessAll - Pathname [" + info.pathname + "] mathched with [" + where + "]");

    pageLoadVillageData();
    pageLoadBotData();

    village.Resources.production = villageGetResourceProduction();

    if (checkGlobalRemoveInGameHelp === "On" | checkGlobalRemoveInGameHelp === "null")
        globalRemoveInGameHelp();

    if (checkGlobalStorageOverflowTimeout === "On" | checkGlobalStorageOverflowTimeout === "null")
        globalOverflowTimer();

    if (botActivated === "On" | botActivated === "null")
        globalShowBotOptions();

    if (where === "Build") globalInBuild();
    else if (where == "VillageOut") globalInVillageOut();
    else if (where == "VillageIn") globalInVillageIn();
    else if (where === "SendTroops") globalInSendTroops();
    else if (where === "Reports") globalInReports(info.search);
    else return;
}

/**
 * Determines where in gameplay current page is.
 *
 * @author Aleksandar Toplek
 *
 * @return {String} Returns a name of gameply part.
 *                    (e.g. Map, SendTroops, VillageIn, ...)
 */
function pageGetWhere(pathname) {
    if      (pathname.match(/dorf1.php/gi))     return "VillageOut";
    else if (pathname.match(/dorf2.php/gi))     return "VillageIn";
    else if (pathname.match(/dorf3.php/gi))     return "VillageOverview";
    else if (pathname.match(/build.php/i))      return "Build";
    else if (pathname.match(/karte.php/gi))     return "Map";
    else if (pathname.match(/a2b.php/gi))       return "SendTroops";
    else if (pathname.match(/berichte.php/gi))     return "Reports";

    return undefined;
}

/**
 * Filters active village from name right village list
 *
 * @author Aleksandar Toplek
 *
 * @returns {String} Name of active village
 */
function globalGetActiveVillageName() {
    devLog("globalGetActiveVillageName - Getting village name...");

    var name = $("li[class*='entry'] > a[class='active']").text();

    devLog("globalGetActiveVillageName - Village name [" + name + "]");
    return name;
}

/**
 * Filters active village Id from right village list
 *
 * @author Ignacio Munizaga
 *
 * @returns {String} id of active village
 */
function globalGetActiveVillageId() {
    devLog("globalGetActiveVillageId - Getting village id...");

    var id = $("li[class*='entry'] > a[class='active']").attr("href").match(/\d+/g)[0];

    devLog("globalGetActiveVillageId - Village id [" + id + "]");

    return id;
}

/**
 * creates a unique identifier (through servers) of the village
 *
 * @author Ignacio Munizaga
 *
 * @returns {String} inter-server village id
 */
function globalGetActiveVillageUniversalIdentifier() {
    devLog("globalGetActiveVillageUniversalIdentifier - Getting village UID...");

    var uid = document.domain + globalGetActiveVillageId();

    devLog("globalGetActiveVillageUniversalIdentifier - Village uid [" + uid + "]");

    return uid;
}

/**
 * Filters all villages from right village list and only returns non active ones.
 *
 * @author Aleksandar Toplek
 *
 * @return {Array} Returns array of 'a' elemets with href to village view and name in text.
 */
function globalGetVillagesList() {
    devLog("globalGetVillagesList - Getting village list...");

    var villagesList = $("div[id='villageList'] > div[class='list'] > ul > li[class*='entry'] > a[class!='active']");

    devLog("globalGetVillagesList - Village list: " + villagesList);
    return villagesList;
}

/**
 * Removes in game help link from every travian page.
 * On some servers this wont remove stone and book since they are
 * on one static image, it will only remove question mark and link.
 *
 * @author Aleksandar Toplek
 */
function globalRemoveInGameHelp() {
    devLog("globalRemoveInGameHelp - Removing in game help...");

    $("#ingameManual").remove();

    devLog("globalRemoveInGameHelp - In game help removed!");
}

/**
 * Shows options for the bot
 *
 * @author Ignacio Munizaga
 */
function globalShowBotOptions() {
    devLog("globalShowBotOptions - Initializing...");

    $villageNameDiv = $("#villageName");

    $villageNameDiv.append("<div id='bot_options'><input type='checkbox' id='bot_activated''/>Activate bot</input></div>");

    var $botActivated = $('#bot_activated');
    $botActivated.attr('checked', bot.active);
    $botOptions = $("#bot_options");
    $botOptions.css("background-color", "#ffffff");
    $botOptions.css("margin-top", "20px");
    $botOptions.css("border-radius", "5px");
    $botOptions.css("border-radius", "5px");
    $botOptions.css("opacity", "0.95");
    $botOptions.css("box-shadow", "1px 1px 2px #000");
    $botOptions.bind('click', function(){
            bot.toggleBot();
    });

    devLog("globalShowBotOptions - Finished!");
}

/**
 * Informs about warehouse and granary overflow
 *
 * @author Aleksandar Toplek
 */
function globalOverflowTimer() {
    devLog("globalOverflowTimer - Initializing...");

    $("#res").children().each(function(index) {
        // Skips crop consumption
        if (index !== 4) {
            var actualProduction = village.Resources.production[index];
            if(actualProduction == 0)
            {
                $(this).append("<div style='background-color: #EFF5FD;'><b><p id='paResourceOverflowTime" + index + "' style='text-align: right;'>" + _gim("TravianNever") + "</p></b></div>");
            }
            else {
                var current     = globalGetWarehousAmount(index + 1);

                if(actualProduction > 0) {
                    var max         = globalGetWarehousMax(index + 1);
                    var timeLeft     = (max - current) / actualProduction;

                    $(this).append("<div style='background-color: #EFF5FD;'><b><p id='paResourceOverflowTime" + index + "' style='text-align: right;'>" + _hoursToTime(timeLeft) + "</p></b></div>");
                }
                else {
                    var timeLeft     = current / Math.abs(actualProduction);

                    $(this).append("<div style='background-color: #EFF5FD;  color:red !important; border: 1px solid red;'><b><p id='paResourceOverflowTime" + index + "' style='text-align: right;'>" +  _hoursToTime(timeLeft) + "</p></b></div>");

                }
            }
            devLog("globalOverflowTimer - l" + (index + 1) + " appended!");

        }
    });

    setInterval(globalOverflowTimerFunction, 1000, "paResourceOverflowTime");
    devLog("globalOverflowTimer - Timer registered!");

    devLog("globalOverflowTimer - Finished!");
}

/**
 * Called by GlobalOverflow timer
 *
 * @author Aleksandar Toplek
 *
 * @param {String} id         Element id
 * @param {String} cother    Color for hours > 2
 * @param {String} cclose     Color for hours < 2
 * @param {String} calmost     Color for hours < 0.75
 * @param {String} czero    Color for hours = 0
 */
function globalOverflowTimerFunction(id, czero, calmost, cclose, cother) {
    for (var index = 0; index < 4; index++) {
        $("#" + id + index).each(function() {
            // Get current time from element
            var hours = _timeToHours($(this).text());

            if (dbgtmrs) devLog("globalOverflowTimerFunction - l" + (index + 1) + "   " + $(this).text() + "    " + hours);

            // Not updating if 00:00:00
            if (hours > 0) {
                // Subtracts one second and writes new text to element
                hours -= 0.0002777006777777; // 1 s -> 1/~3600 (3601 because of calculation error)
                $(this).html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + _hoursToTime(hours));
            }

            // Changes element style (color) depending on current time state
            if (hours === 0) $(this).attr("style", "text-align: right; color:" + (czero || "#B20C08") + ";");
            else if (hours < 0.75) $(this).attr("style", "text-align: right; color:" + (calmost || "#B20C08") + ";");
            else if (hours < 2) $(this).attr("style", "text-align: right; color:" + (cclose || "#FFCC33") + ";");
            else $(this).attr("style", "text-align: right; color:" + (cother || "black") + ";");
        });
    }
}

/**
 * Shows log information only if on dev model
 *
 * @author Everton Moreth
 *
 * @param {*}*     Accepts any "loggable" parameters, in any quantity
 */
function devLog() {
    if (dev) console.log.apply(console, arguments);
}

/**
 * Warehouse current amount of [index] resource
 *
 * @author Aleksandar Toplek
 *
 * @param {Number}     index     An index of resource
 *                             1 for wood, 2 for clay, 3 for iron, 4 for crop
 *
 * @return {Number}         Returns an amount of resource currently in storage
 */
function globalGetWarehousAmount(index) {
    return parseInt(globalGetWarehousInfo(index).split("/")[0], 10);
}

/**
 * Warehouse maximum amount of [index] resource
 *
 * @author Aleksandar Toplek
 *
 * @param {Number}     index     An index of resource
 *                             1 for wood, 2 for clay, 3 for iron, 4 for crop
 *
 * @return {Number}         Returns maximum amount of resource that could be stored in storage
 */
function globalGetWarehousMax(index) {
    return parseInt(globalGetWarehousInfo(index).split("/")[1], 10);
}

/**
 * Warehouse info about [index] resource
 *
 * @author Aleksandar Toplek
 *
 * @param {Number}     index     An index of resource
 *                             1 for wood, 2 for clay, 3 for iron, 4 for crop
 *
 * @return {Number}         Returns an amount of resource currently in storage
 */
function globalGetWarehousInfo(index) {
    return $("#l" + (index)).text();
}

/**
 * Calls all Village Out related functions.
 *
 * @author Ignacio Munizaga
 */
function globalInVillageOut() {
    if (dev) console.log("globalInVillageOut() - In Village Out calls...");

    // check if there are enough resources to build fields
    var buildableFields = []
    var villageMap = Enums.VillageMaps[village.VillageOut.type];
    $("#rx").children().each(function(fieldIndex) {
        for (var resourceIndex = 0; resourceIndex < 4; resourceIndex++) {
            if ($.inArray(fieldIndex, villageMap[resourceIndex]) != -1){
                var $this = $(this);
                var level = parseInt($this.attr('alt').match(/\d+/g)[0]);
                var next_level = "lvl" + (level + 1);
                var enough_resources = true;
                for (var cost_index = 1; cost_index < 5; cost_index++) {
                    var FieldCostIndex = Enums.Fields[resourceIndex]
                    var current_cost = FieldCostIndex[next_level][cost_index-1];
                    var current_ammount = globalGetWarehousAmount(cost_index);
                    if (current_cost > current_ammount){
                        enough_resources = false;
                        break;
                    }
                }
                if (enough_resources){
                    buildableFields.push([fieldIndex, resourceIndex, level]);
                }
                break;
            }
        }
    });

    // call the bot operations on village out
    bot.villageOutLogic(buildableFields);

    if (colorBuildableFields === "On" | colorBuildableFields === "null") {
        var offset = 0;
        for (var index in buildableFields) {
            var buildableField = buildableFields[index];

            // level 0 fields cannot be painted
            if (buildableField[2] == 0){
                offset++;
                continue;
            }

            var fieldIndex = buildableField[0];
            $current_circle = $("#village_map .level").eq(fieldIndex - offset);
            $current_circle.css("font-size", "20px");
            $current_circle.css("color", "#ffffff");
            $current_circle.css("background-color", "#AAFF55");
            $current_circle.css("padding", "#AAFF55");
            $current_circle.css("border-radius", "20px");
            $current_circle.animate({top: "+=-2"});
        }
    }
    if (dev) console.log("globalInVillageOut() - In Village out finished successfully!");
}


/**
 * Calls all Village Out related functions.
 *
 * @author Ignacio Munizaga
 */
function globalInVillageIn() {
    if (dev) console.log("globalInVillageIn() - In Village In calls...");

    if (checkBuildBuildingResourceDifference === "On" | checkBuildBuildingResourceDifference === "null") {
        $("#clickareas").children().each(function(index) {
            if (dev) console.log("globalInVillageIn()" + index);
        });
    }
    if (dev) console.log("globalInVillageIn() - In Village in finished successfully!");
}

/**
 * Calls all Build related functions.
 *
 * @author Aleksandar Toplek
 */
function globalInBuild() {
    devLog("globalInBuild() - In buils calls...");

    if (checkBuildBuildingResourceDifference === "On" | checkBuildBuildingResourceDifference === "null")
        buildCalculateBuildingResourcesDifference();

    if (checkBuildUnitResourceDifference === "On" | checkBuildUnitResourceDifference === "null")
        buildCalculateUnitResourcesDifference();

    if ($(".gid17").length) buildMarketCalls();

    devLog("globalInBuild() - In build finished successfully!");
}

/**
 * Calls all Send troops related functions.
 *
 * @author Aleksandar Toplek
 */
function globalInSendTroops() {
    devLog("globalInSendTroops - In send troops calls...");

    if (checkSendTroopsListMyVillages === "On" | checkSendTroopsListMyVillages === "null")
        sendTroopsFillVillagesList();

    devLog("globalInSendTroops - In send troops finished successfully!");
}

/**
 * Calls all Reports related functions
 *
 * @author Aleksandar Toplek
 *
 * @param {String} search Search/Query of current page
 */
function globalInReports(search) {
    devLog("globalInReports - In reports calls...");

    if (search.search("t=5") == -1) {
        devLog("globalInReports - Reports");

        if (checkReportShowCheckAll === "On" | checkReportShowCheckAll === "null")
            reportsShowCheckAll();
    }
    else {
        devLog("globalInReports - Report view");

        // No current use
    }

    devLog("globalInReports - In reports finished successfully!");
}

/**
 * Calculates resource difference.
 * A resource difference is between storage and cost.
 *
 * @author Aleksandar Toplek
 */
function buildCalculateBuildingResourcesDifference() {
    devLog("buildCalculateBuildingResourcesDifference - Calculating building resource differences...");

    for (var rindex = 0; rindex < 4; rindex++) {
        var inWarehouse = globalGetWarehousAmount(rindex + 1);

        // Building cost
        // .costs are for town hall celebration
        // .contractCosts are for building/upgreding building
        $(".contractCosts > div > span[class*='resources r" + (rindex + 1) + "'],.costs > div > span[class*='resources r" + (rindex + 1) + "']").each(function(index) {
            var res = parseInt($(this).text(), 10);
            var diff = inWarehouse - res;
            var color = diff < 0 ? "#B20C08" : "#0C9E21";
            var div = "<div style='color:" + color + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(" + diff + ")</div>";

            $(this).append(div);

            devLog("buildCalculateBuildingResourcesDifference - r" + (rindex + 1) + " diff[" + diff + "]");

            $(this).append("<div id='paResourceDifferenceC" + index + "R" + rindex + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" + _hoursToTime(diff < 0 ? (-diff) / village.Resources.production[rindex] : 0) + "</div>");
            globalOverflowTimerFunction("paResourceDifferenceC" + index + "R", '#0C9E21', '#AEBF61', '#A6781C', '#B20C08');
            if (rindex === 0) {
                setInterval("globalOverflowTimerFunction('paResourceDifferenceC" + index + "R', '#0C9E21', '#AEBF61', '#A6781C', '#B20C08')", 1000);
            }
        });
    }

    devLog("buildCalculateBuildingResourcesDifference - Building resource differences calculated!");
}

/**
 * Info about untit and storage resource difference
 *
 * @author Aleksandar Toplek
 */
function buildCalculateUnitResourcesDifference() {
    devLog("buildCalculateUnitResourcesDifference - Calculating unit resource difference...");

    var inputs = $("input[name*='t']");
    var costs = $(".details > .showCosts");

    for (var rindex = 0; rindex < 4; rindex++) {
        inputs.each(function(iindex) {
            $(costs[iindex]).children("span[class*='resources r" + (rindex + 1) + "']").append(
                "<div id='paUnitCostDifferenceI" + iindex + "R" + rindex + "' style='color:#0C9E21'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(0)</div>");
        });
    }

    setInterval(buildCalculateUnitResourcesDifferenceTimerFunction, timerStep, [inputs, costs]);

    devLog("buildCalculateUnitResourcesDifference - Timer registerd!");

    devLog("buildCalculateUnitResourcesDifference - Unit resource differences calculated!");
}

/**
 * Called by buildCalculateUnitResourceDifference timer
 * Function that actualy changes and calculates values
 *
 * @author Aleksandar Toplek
 *
 * @param {Array} args  Index 0 represents unit inputs
 *                      Index 1 represents unit cost
 */
function buildCalculateUnitResourcesDifferenceTimerFunction(args) {
    for (var rindex = 0; rindex < 4; rindex++) {
        var inWarehouse = globalGetWarehousAmount(rindex + 1);

        args[0].each(function(iindex) {
            var res = parseInt($(args[1][iindex]).children("span[class*='resources r" + (rindex + 1) + "']").text(), 10);
            quantity = parseInt($(this).attr("value"), 10);
            // it's not intuitive if quantity is zero.
            if (quantity == 0) {
                quantity = 1;
            }
            var diff = inWarehouse - res * quantity;
            var color = diff < 0 ? "#B20C08" : "#0C9E21";
            $("#paUnitCostDifferenceI" + iindex + "R" + rindex ).html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(" + diff + ")");
            $("#paUnitCostDifferenceI" + iindex + "R" + rindex ).attr("style", "color:" + color);

            if (dbgtmrs) devLog("buildCalculateUnitResourcesDifferenceTimerFunction - diff [" + diff + "]");
        });
    }
}

/**
 * Calls all marketplace related functions
 *
 * @author Aleksandar Toplek
 */
function buildMarketCalls() {
    devLog("buildMarketCalls - Marketplace calls...");

    var traderMaxTransport = buildMarketGetTraderMaxTransport();
    var tradersAvailable = buildMarketGetTradersAvailable();

    console.info("buildMarketCalls - traderMaxTransport [" + traderMaxTransport + "]");
    console.info("buildMarketCalls - tradersAvailable [" + tradersAvailable + "]");

    if (checkMarketListMyVillages === "On" | checkMarketListMyVillages === "null")
        buildMarketFillVillagesList();

    buildMarketAddTransportShortcuts(traderMaxTransport);

    if (checkMarketShowJunkResource === "On" | checkMarketShowJunkResource === "null") {
        buildMarketInsertJunkResourceTable();
        buildMarketRegisterTimerFillInJunkResource([tradersAvailable, traderMaxTransport]);
    }

    if (checkMarketShowSumIncomingResources === "On" | checkMarketShowSumIncomingResources === "null")
        buildMarketIncomingSum();

    devLog("buildMarketCalls - Marketplace calls finished...");
}

/**
 * Registers an timer that calls buildMarketFillInJunkResource multiple times
 *
 * @author Aleksandar Toplek
 */
function buildMarketRegisterTimerFillInJunkResource(args) {
    setInterval(buildMarketFillInJunkResourceTimer, timerStep, args);

    devLog("buildMarketRegisterTimerFillInJunkResource - Timer set to interval [250]");
}

/**
 * Inserts JunkResource rows in the end of resource selection table
 *
 * @author Aleksandar Toplek
 */
function buildMarketInsertJunkResourceTable() {
    devLog("buildMarketInsertJunkResourceTable - Inserting Junk resources table...");

    $(".send_res > tbody").append("<tr><td></td><td></td><td class='currentLoaded'>0 </td><td class='maxRes'>/ 0</td></tr><tr><td></td><td></td><td>Junk:</td><td class='junkAmount'>0 (0)</td></tr>");

    devLog("buildMarketInsertJunkResourceTable - Junk resources table inserted successfully...");
}

/**
 * Called by FillInJunkResource timer
 * Actualy caltulates and fills values of pre-inserted table
 *
 * @author Aleksandar Toplek
 *
 * @param {Array} args  1 represents trader maximal transport amount
 *                      0 represents how much traders is available
 */
function buildMarketFillInJunkResourceTimer(args) {
    var resMax = args[0] * args[1];
    var resSum = 0;
    var tradersNeeded = 0;

    // Get input values
    var r1 = _getAttrNumber("#r1", "value");
    var r2 = _getAttrNumber("#r2", "value");
    var r3 = _getAttrNumber("#r3", "value");
    var r4 = _getAttrNumber("#r4", "value");

    // Calulate sum of values
    resSum = r1 + r2 + r3 + r4;

    // Calculates min number of traders needed for transport
    var tempRes = resSum;
    while (tempRes > 0) {
        tradersNeeded++;
        tempRes -= args[1];
    }

    // Calculates junk amount
    var junkAmount = tradersNeeded * args[1] - resSum;

    // Styles of row (indicating too much resource requested / more traders needed)
    if (tradersNeeded > args[0])
        $(".currentLoaded").attr("style", "color:red;");
    else $(".currentLoaded").attr("style", "");

    // Changes value of pre-inserted rows
    $(".currentLoaded").html(resSum + " ");
    $(".maxRes").html("/ " + resMax);
    $(".junkAmount").html((tradersNeeded > args[0] ? "NA" : junkAmount) + " (" + tradersNeeded + ")");

    if (dbgtmrs) devLog("buildMarketFillInJunkResourceTimer - traders [" + args[0] + "] each [" + args[1] + "] sending [" + resSum + "] with junk [" + junkAmount + "]");
}

/**
 * Looks for value of available traders
 *
 * @author Aleksandar Toplek
 *
 * @return {Number} Available traders or 0 if undefined
 */
function buildMarketGetTradersAvailable() {
    devLog("buildMarketGetTradersAvailable - Started...");

    var tradersSource = $("div[class*='traderCount'] > div:last").text();

    // NOTE: Regex code automated generator
    // http://txt2re.com/index-javascript.php3

    // Input sample: _16_/_22___... (where _ means space)
    // Return sample: 16 (integer)

    var p = new RegExp('(\\d+)', ["i"]);
    var result = p.exec(tradersSource);

    devLog("buildMarketGetTradersAvailable - Finished! Traders available [" + result[1] + "]");

    return parseInt(result[1], 10) || 0;
}

/**
 * Gets how mush one trader can transport
 *
 * @author Aleksandar Toplek
 *
 * @return {Number} Trader maximal resource transport or 0 if undefined
 */
function buildMarketGetTraderMaxTransport() {
    return parseInt($(".send_res > tbody > tr:eq(0) > .max > a").text() || 0, 10);
}

/**
 * Replaces market village name text box with selection of players villages
 *
 * @author Aleksandar Toplek
 */
function buildMarketFillVillagesList() {
    devLog("buildMarketFillVillagesList - Started...");

    fillVillagesList();

    devLog("buildMarketFillVillagesList - Textbox successfully replaced!");
}

/**
 * Adds resource shortcuts (e.g. 1x, 2x traders maximal transport amount)
 *
 * @author Aleksandar Toplek
 *
 * @param {Number} traderMaxTransport Trader maximum resource transport amount
 */
function buildMarketAddTransportShortcuts(traderMaxTransport) {
    devLog("buildMarketAddTransportShortcuts - Started...");

    // SAMPLE: "<a href='#' onmouseup='add_res(1);' onclick='return false;'>1000</a>"

    devLog("buildMarketAddTransportShortcuts - Adding 1x shortcut");
    // 1x shortcut
    for (var index = 0; index < 4; index++) {
        var addCall = "add_res(" + (index + 1) + ");";
        var strX1 = "/ <a href='#' onmouseup='" + addCall + "' onclick='return false;'>" + traderMaxTransport + "</a><br>";
        $(".send_res > tbody > tr:eq(" + index + ") > .max").html(strX1);
    }

    devLog("buildMarketAddTransportShortcuts - 1x shortcud added!");
    devLog("buildMarketAddTransportShortcuts - Adding 2x shortcut");
    // 2x shortcut
    if (checkMarketShowX2Shortcut === "On" | checkMarketShowX2Shortcut === "null") {
        for (var index = 0; index < 4; index++) {
            var addCall = "add_res(" + (index + 1) + ");";
            var strX2 = "/ <a href='#' onmouseup='" + addCall + addCall + "' onclick='return false;'>" + traderMaxTransport * 2 + "</a><br>";
            $(".send_res > tbody > tr:eq(" + index + ") > .max").append(strX2);
        }
        devLog("buildMarketAddTransportShortcuts - 1x shortcud added!");
    }

    devLog("buildMarketAddTransportShortcuts - Finished successfully!");
}

/**
 * Puts table with resource sum of incoming trades to beginning
 *
 * @author Aleksandar Toplek
 */
function buildMarketIncomingSum() {
    devLog("buildMarketIncomingSum - Generating table...");

    var sum         = [0, 0, 0, 0];
    var count         = 0;
    var tableIndex     = 0;

    var maxTime     = 0; // Temp variable
    $(".traders").each(function(index) {
        var bodys = $(this).children("tbody");
        if (bodys.length === 2) {
            // Gets max time and timer name
            var timeSpan     = $(bodys[0].children).children("td").children("div:first").children();
            var time         = timeSpan.text();
            var timeSplit     = time.split(":");
            var timeInteger = timeSplit[0] * 3600 + timeSplit[1] * 60 + timeSplit[2] * 1;

            if (timeInteger > maxTime) {
                maxTime     = timeInteger;
                tableIndex     = index;
                count++;
            }

            // Gets resources and sums it to total
            var res         = $(bodys[1].children).children("td").children().text();
            var resSplit     = res.split(" ");

            for (var i = 0; i < 4; ++i) {
                sum[i] += parseInt(resSplit[i + 1], 10);
            }
        }
    });

    // Checks if any incoming trade exists
    if (count > 0) {
        // Recreate table with custom text
        var sourceTable = $(".traders:eq(" + tableIndex + ")");

        var customTable = $(sourceTable.outerHTML());

        // Head customization
        customTable.children("thead").children().children().each(function(index) {
            if (index === 0) $(this).html(_gim("TravianTotalIncoming"));
            else $(this).html(_gim("TravianIncomingFrom") + " " + count + " " + _gim("TravianVillagesLC"));
        });

        customTable.children("tbody:first").children().children("td").children(".in").children().attr("id", "paIncomingSumTimer");

        // Resource customization
        customTable.children("tbody:last").children().children("td").children().html(
            "<img class='r1' src='img/x.gif' alt='wood'> " + sum[0] + "&nbsp;&nbsp;" +
            "<img class='r2' src='img/x.gif' alt='clay'> " + sum[1] + "&nbsp;&nbsp;" +
            "<img class='r3' src='img/x.gif' alt='iron'> " + sum[2] + "&nbsp;&nbsp;" +
            "<img class='r4' src='img/x.gif' alt='crop'> " + sum[3] + "&nbsp;&nbsp;"
            );

        devLog("buildMarketIncomingSum - Table generated! Appending table to beginning...");

        // Appends custom table to beginning
        $(".traders:first").before(customTable.outerHTML());

        devLog("buildMarketIncomingSum - Table appended successfully! Asigning timer...");

        // Updates incoming left time every 128 ms to original table value
        setInterval(function() {
            $("#paIncomingSumTimer").text(
                sourceTable.children("tbody:first").children().children("td").children(".in").children().text());
        }, timerStep);
    }

    devLog("buildMarketIncomingSum - Finished successfully!");
}

/**
 * Replaces SendToops village name text box with selection of players villages
 *
 * @author Aleksandar Toplek
 */
function sendTroopsFillVillagesList() {
    devLog("sendTroopsFillVillagesList - Started...");

    fillVillagesList();

    // minor css fixes
    $("div.a2b .destination").css("width", "235px");
    $("div.a2b .option").css("float", "none");
    $("div.a2b .option").css("display", "inline");
    $("enterVillageName").css("display", "inline");


    devLog("sendTroopsFillVillagesList - Finished successfully!");
}

/**
 * Creates a List of cities to send troos/resources to
 *
 * @author Ignacio Munizaga
 */
function fillVillagesList() {
    devLog("fillVillagesList - Started...");

    // Gets data
    var selectData = globalGetVillagesList();
    var selectInput = _selectB("enterVillageName_list", "text village", "dname");

    devLog("fillVillagesList - Generating selection...");

    selectInput += _selectOption(_gim("TravianSelectVillage"));
    $.each(selectData, function(current, value) {
        selectInput += _selectOption(value.text);
    });
    selectInput += _selectE();

    devLog("fillVillagesList - Selection generated!");

    // Creates two radio buttons for choosing the method of city selection
    // These radio buttons does not have names in order to be invisible on the
    // server side (radio with no names are not send on form submission)
    var _textRadio = $('<input type="radio" id="NameOption_text" />');
    var _listRadio = $('<input type="radio" id="NameOption_list" checked="checked"/>');

    var _compactInput = $(".compactInput");
    _compactInput.prepend(_textRadio);
    _compactInput.append($("<br />"));
    _compactInput.append(_listRadio);

    // Click handler for radios. Each radio must uncheck the other one.
    // Once they dont have names, their original behaviour does not happen
    // They also have to disable the option that is not being used.
    // Disabled form elemens are not sent in form submission, so they are
    // not sent twice
    _textRadio.click(function(){
        $("#NameOption_list").attr("checked", false);
        $("#enterVillageName_list").attr("disabled", true);
        $("#enterVillageName").attr("disabled", "");
    });

    _listRadio.click(function(){
        $("#NameOption_text").attr("checked", false);
        $("#enterVillageName").attr("disabled", true);
        $("#enterVillageName_list").attr("disabled", "");
    });

    // Disables the original name selector by default
    // Changes the width to match the layout
    $("#enterVillageName").attr("disabled", true).css("width", "78%");
    $("#enterVillageName").attr("disabled", true).css("display", "inline");

    // Replaces textbox with selectionbox (drop-down)
    _compactInput.append(selectInput);

    devLog("fillVillagesList - Textbox successfully replaced!");
}

/**
 * Adds checkbox on the end of reports list to check all reports
 *
 * @author Aleksandar Toplek
 */
function reportsShowCheckAll() {
    devLog("reportsShowCheckAll - Started...");

    if (!$("#markAll").length) {
        devLog("reportsShowCheckAll - Generating data...");

        var sourceScript = "$(this).up('form').getElements('input[type=checkbox]').each(function(element){element.checked = this.checked;}, this);";
        var sourceCode = "<div id='markAll'><input class='check' type='checkbox' id='sAll'><span><label for='sAll'>" + _gim("TravianSelectAll") + "</label></span></div>";

        var obj = $(sourceCode);
        obj.children("input").attr("onClick", sourceScript);

        $(".paginator").before(obj.outerHTML());

        devLog("reportsShowCheckAll - Box appended");
    }
    else devLog("reportsShowCheckAll - Box already exists (user uses PLUS account)");

    devLog("reportsShowCheckAll - Finished successfully!");
}

/**
 * Transforms given time string into hours number
 *
 * @author Aleksandar Toplek
 *
 * @param {String} time     Time as string
 *
 * @return {Number} Hours as number
 *                  For input [02:19:59] output would be [2.333055555555556]
 */
function _timeToHours(time) {
    var split = time.split(":");

    var hours = parseInt(split[0], 10) + (parseInt(split[1], 10) / 60) + (parseInt(split[2], 10) / 3600);
    //console.warn(time + "    {" + split + "} =>  " + hours + " split(0)" + parseInt(split[0], 10) + " split(1)" + parseInt(split[1], 10) + " split(2)" + parseInt(split[2], 10));

    return hours;
}

/**
 * Transforms given hours number to time string
 *
 * @author Aleksandar Toplek
 *
 * @param {Number} hours    Number representing hours (e.g. 1.253343333, ...)
 *
 * @return {String} Time as string
 *                  For input [2.333055555555556] output would be [02:19:59]
 *
 * @private
 */
function _hoursToTime(hours) {

    var _hours = hours;
    _hours = Math.floor(_hours);
    hours -= _hours;
    hours *= 60;

    var _minutes = hours;
    _minutes = Math.floor(_minutes);
    hours -= _minutes;
    hours *= 60;

    var _seconds = parseInt(hours, 10);
    //_seconds = Math.floor(_seconds);

    return     (_hours < 10 ? '0' + _hours : _hours) + ":" +
    (_minutes < 10 ? '0' + _minutes : _minutes) + ":" +
    (_seconds < 10 ? '0' + _seconds : _seconds);
}

/**
 * Trys to parse given attribute to Number
 *
 * @author Aleksandar Toplek
 *
 * @param {Object} _element     Elemet with wanted attribute
 * @param {object} _attribute   Attribute to parse
 *
 * @return {Number} Number or 0 if attribute is NaN
 *
 * @private
 */
function _getAttrNumber (_element, _attribute) {
    return _toInt(($(_element)).attr(_attribute));
}

/**
 * Trys to parse given value to Number
 *
 * @author Aleksandar Toplek
 *
 * @param {Object} value Value to try parse
 *
 * @return {Number} Number or 0 if value is NaN
 *
 * @private
 */
function _toInt(value) {
    var num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

/**
 * (Helper) Selection element begining tag
 *
 * @author Aleksandar Toplek
 *
 * @param {String}  _id     ID attribute
 * @param {String}  _class  Class attribute
 * @param {String}  _name   Name attribute
 *
 * @return {String} Selection begning tag (e.g. <select ...>)
 *
 * @private
 */
function _selectB (_id, _class, _name) {
    return     "<select " +
    (_id == undefined         ? "" : "id='"         + _id         + "' ") +
    (_class == undefined     ? "" : "class='"     + _class     + "' ") +
    (_name == undefined     ? "" : "name='"     + _name     + "' ") +
    ">";
}


/**
 * (Helper) Selection element -> Child option tag
 *
 * @author Aleksandar Toplek
 *
 * @param {String}  _value      Value attribute
 * @param {String}  _id         ID attribute
 * @param {Boolean} _selected   Selected attribute
 *
 * @return {String} Option tag (e.g. <option ...>...</option>)
 *
 * @private
 */
function _selectOption (_value, _id, _selected) {
    return "<option " + (_id == undefined ? "" : "id='" + _id + "' ") + (_selected == undefined ? "" : "selected") + ">" + _value + "</option>";
}

/**
 * (Helper) Selection element end tag
 *
 * @author Aleksandar Toplek
 *
 * @return Selection end tag (e.g. </select>)
 *
 * @private
 */
function _selectE () {
    return "</select>";
}

/**
 * (Helper) Gets locale message
 *
 * @author Aleksandar Toplek
 *
 * @param {String} name Name of locale message
 *
 * @return {String} Message from current locale language
 *
 * @private
 */
function _gim(name) {
    return chrome.i18n.getMessage(name);
}

/**
 * Gets current village resource production per hour
 *
 * @author Aleksandar Toplek
 *
 * @returns {Array} Resource production
 *                     0 wood, 1 clay, 2 iron, 3 crop
 */
function villageGetResourceProduction() {
    var perHour     = [0, 0, 0, 0];

    var resources = {};
    eval($("script:contains('resources.production')").text())

    for(var i = 0; i < 4; i++) {
        perHour[i] = resources.production["l" + (i+1)];
    }
    devLog("globalOverflowTimer - Resources per hour: " + perHour[0] + " " + perHour[1] + " " + perHour[2] + " " + perHour[3]);

    return perHour;
}


/**
 * Sends request for Notification message
 *
 * @author Aleksandar Toplek
 *
 * @param {String} image Image name
 * @param {String} message Message to show
 *
 * @private
 */
function _sendNotifiRequest(image, message) {
    _sendExtensionProcessRequest("ShowNotification", new Notification(image, "ProjectAxeman", message));
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function Notification(image, title, message) {
    this.Image = image;
    this.Title = title;
    this.Message = message;
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function _sendDataGetRequest(name, callback) {
    _sendRequest(new Request("Data", name, "get"), callback);
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function _sendDataSetRequest(name, data, callback) {
    _sendRequest(new Request("Data", name, "set", data), callback);
}

//TODO: Comment function
//TODO: Log function
function _sendTravianGetRequest(name, callback) {
    _sendRequest(new Request("Travian", name, "get"), callback);
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function _sendTravianProcessRequest(name, data, callback) {
    _sendRequest(new Request("Travian", name, "process", data), callback);
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function _sendTravianSetRequest(name, data, callback) {
    _sendRequest(new Request("Travian", name, "set", data), callback);
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function _sendExtensionGetRequest(name, callback) {
    _sendRequest(new Request("Extension", name, "get"), callback);
}

//TODO: Comment function
//TODO: Log function
function _sendExtensionProcessRequest(name, data, callback) {
    _sendRequest(new Request("Extension", name, "process", data), callback);
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function _sendExtensionSetRequest(name, data, callback) {
    _sendRequest(new Request("Extension", name, "set", data), callback);
}

//TODO: Comment function
//TODO: Log function
//TODO: Test function
function Request(category, name, action, data) {
    this.Category = category;
    this.Name = name;
    this.Action = action;
    this.Data = data;
}

// TODO: Comment function
// TODO: Log function
// TODO: Test function
function _sendRequest(request, callback) {
    chrome.extension.sendRequest(request, callback || function () {});
}

/**
 * Extension controller
 * Model-View connection
 *
 * @author Aleksandar Toplek
 *
 * @param {Boolean} devMode Developer mode state
 */
function Controller(devMode) {
    InitializeController();

    function BeginInitialization() {
        _log("BeginInitialization - Initialization of new controller began...");

        _log("BeginInitialization - Finished!");
    }

    function _log(message) {
        console.log(message);
    }
}

/**
 * View functions (retrieve&modify)
 * View part of MVC framework
 *
 * @author Aleksandar Toplek
 */
function PageView() {

// Page data
// NOT NEEDED SINCE ITS ONLY VARIABLE IN CLASS
//    this.Gatherer = {

//    };
// This is done through view object
/*
    // Page modifications
    this.Modifier = {

    };
*/
}

function Village() {
    // NOTE: Any *.travian.*/... page (except help)
    this.name = "<NameNotDefined>";
    this.loyalty = 100;

    // NOTE: On spieler.php?uid=* page
    this.isMainCity = false;
    this.population = 0;
    this.coordX = 0;
    this.coordY = 0;


    // TODO: Is this data or control?
    //this.resourceOverflowLastUpdate = 0;
    //this.resourceOverflowTime = [0, 0, 0, 0];

    // NOTE: On any *.travian.*/... page (except help)
    this.Resources = {
        lastUpdated: 0,

        storage: [0, 0],
        production: [0, 0, 0, 0]
    };

    // NOTE: On dorf2.php
    this.VillageIn = {
        lastUpdated: 0,

        levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        buildings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    // NOTE: On dorf1.php
    this.VillageOut = {
        lastUpdated: 0,
        type: $('#village_map').attr('class'),
        levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    this.Troops = {
        lastUpdatedMyTroops: 0,
        lastUpdatedTotalTroops: 0,

        // NOTE: myTroops don't count units in support or attack
        // NOTE: On dorf1.php
        myTroops: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // Note: On build.php?id=39 (rally point)
        TotalTroops: {
            gauls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            romans: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            teutons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            nature: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    };

    this.Queue = {
        // NOTE: On dorf1.php
        // NOTE: On dorf2.php
        Building: {

        },
        // NOTE: On build.php > barracks
        // NOTE: On build.php > stable
        // NOTE: On build.php > Workshop
        Troops: {

        },
        // Note: On build.php > palace
        // NOTE: On build.php > residence
        PalaceResidence: {

        },
        // NOTE: On build.php > armory
        Armory: {

        },
        // NOTE: On build.php > town hall
        TownHall: {

        }
    };

    // TODO: Oases
    // TODO: Artefacts
    // TODO: Can build/conquer new village
    // TODO: Culture points
}

function Bot(botData){
    this.orders = botData['orders'];
    this.active = ((botActivated === "On" | botActivated === "null") && botData['active']);

    this.addOrder = function(order){
        if (this.active){
            var orderStr = String(order).replace(/\n/g, "");
            var functionStr = "function(){$$}".replace("$$", orderStr);
            this.orders.push("var order = " + functionStr + ";");
        }
    };

    this.getOrder = function(){
        if (this.active){
            debugger;
            var order_str = this.orders.shift();
            eval(order_str);
            return order;
        }
        else return "function(){}";
    };

    this.resetOrders = function(){
        this.orders = [];
    };

    this.goToPage = function(page){
        window.location.href = page;
    }

    this.goToPageInTimeout = function(page, timeout){
        timeout = Math.ceil(timeout * Math.random());
        setTimeout('window.location.href=' + page, timeout);
    }

    this.clickBuildButton = function(){
        var build_button = $('button.build');
        if (build_button != undefined){
            build_button.click();
        }
    }

    this.canBuild = function(){
        return ($('.buildingList').length == 0 && this.orders.length == 0);
    }

    this.toggleBot = function(){
        var $botActivated = $('#bot_activated');
        this.active = $botActivated.attr('checked');
        this.saveData();
        this.goToPageInTimeout('window.location.href', 15000);
    }

    this.saveData = function(){
        _sendDataSetRequest("botData" + village.uid, JSON.stringify({
            active: this.active,
            orders: this.orders
        }));
    }

    this.villageOutLogic = function(buildableFields) {
        // if we can build, and there is something to build
        if (this.canBuild() && buildableFields.length > 0){
            var production = village.Resources.production.slice();
            var cropProduction = production.pop();

            var minProduction = Math.min.apply(Math, production);
            var minProductionIndex = production.indexOf(minProduction);

            // by default build crop
            var buildResource = 3;

            // if the crop production is high, the minor production resource
            if(cropProduction > 10 && cropProduction > (0.5 * minProduction)){
                buildResource = minProductionIndex;
            }

            var minLevel = 21;
            var fieldToBuild;
            for(index in buildableFields){
                var buildableField = buildableFields[index];
                var fieldType = buildableField[1];
                // if this is want we want to build
                if(fieldType == buildResource){
                    var level = buildableField[2];
                    // focus on the lowest level field first
                    if(level < minLevel){
                        minLevel = level;
                        fieldToBuild = buildableField[0];
                    }
                }
            }
            if(fieldToBuild != undefined){
                var next_url = "build.php?id=" + (fieldToBuild + 1);
                bot.addOrder("bot.goToPage('" + next_url + "');");
                bot.addOrder("bot.clickBuildButton()");
            }
        }
        if(this.orders.length == 0){
            // In case of no orders, refresh the page in 5 min
            bot.addOrder("bot.goToPageInTimeout('window.location.href', 300000);");
        }
    }
}
Array.prototype.min = function() {
      return Math.min.apply(null, this)
}

