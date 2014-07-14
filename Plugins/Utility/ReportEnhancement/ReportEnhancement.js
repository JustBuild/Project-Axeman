/******************************************************************************
 * ReportEnhancement.js
 *
 * Author:
 * 		Geczy
 *
 * Created on:
 * 		14.07.2014.
 *
 *****************************************************************************/

function ReportEnhancement() {
    /// <summary>
    /// Initializes object
    /// </summary>
    this.Register = function() {
        Log("Registering ReportEnhancement plugin...", "ReportEnhancement");

        $('#message table').has('td.role').each(function(i) {
            var id = '#message table:eq(' + $('#message table').index(this) + ')';
            var totalTroopLoss = [0, 0, 0, 0];
            $(id + ' tbody.units td.uniticon .unit').each(function(index) {
                var amount = $(id + ' .units.last td:eq(' + index + ')');
                var totalUnits = parseInt(amount.text().trim()) || 0;

                if (totalUnits < 1) {
                    return true;
                }

                var txt = $(this).attr('class');
                var m = new RegExp('.*?' + '(\\d+)', ["i"]).exec(txt);

                if (m == null) {
                    return true;
                }

                var uid = m[1];

                var troopCosts = Enums.TroopResources[uid];
                if (troopCosts) {
                    for (var i = 0; i < 4; i++) {
                        totalTroopLoss[i] += (troopCosts[i] * totalUnits);
                    }
                }

            });

            var totalLoss = 0;
            for (var i in totalTroopLoss) {
                totalLoss += totalTroopLoss[i];
            }

            var html = '';
            html += '<tbody><tr><td class="empty" colspan="12"></td></tr></tbody>';
            html += '<tbody class="losses">';
            html += '    <tr>';
            html += '        <th>Loss</th>';
            html += '        <td colspan="11">';
            html += '            <div class="res">';
            html += '                <div class="rArea">';
            html += '                    <img class="r1" src="img/x.gif" alt="Wood">' + NumberWithCommas(totalTroopLoss[0]) + '</div>';
            html += '                <div class="rArea">';
            html += '                    <img class="r2" src="img/x.gif" alt="Clay">' + NumberWithCommas(totalTroopLoss[1]) + '</div>';
            html += '                <div class="rArea">';
            html += '                    <img class="r3" src="img/x.gif" alt="Iron">' + NumberWithCommas(totalTroopLoss[2]) + '</div>';
            html += '                <div class="rArea">';
            html += '                    <img class="r4" src="img/x.gif" alt="Wheat">' + NumberWithCommas(totalTroopLoss[3]) + '</div>';
            html += '            </div>';
            html += '            <div class="clear"></div>';
            html += '            <div class="totalTroopLoss" style="float: left;width: 100%;margin-top: 10px;">Total: ' + NumberWithCommas(totalLoss) + '</div>';
            html += '        </td>';
            html += '    </tr>';
            html += '</tbody>';
            $(id).append(html);

            return true;

            html += '<style>div.reports #message table .units td {';
            html += 'width: 0%;';
            html += '}</style>';
            html += '<table id="" cellpadding="0" cellspacing="0">';
            html += '    <thead>';
            html += '        <tr>';
            html += '            <td colspan="1"></td>';
            html += '            <td class="role" colspan="5">';
            html += '                <div class="boxes boxesColor red">';
            html += '                    <div class="boxes-tl"></div>';
            html += '                    <div class="boxes-tr"></div>';
            html += '                    <div class="boxes-tc"></div>';
            html += '                    <div class="boxes-ml"></div>';
            html += '                    <div class="boxes-mr"></div>';
            html += '                    <div class="boxes-mc"></div>';
            html += '                    <div class="boxes-bl"></div>';
            html += '                    <div class="boxes-br"></div>';
            html += '                    <div class="boxes-bc"></div>';
            html += '                    <div class="boxes-contents cf">';
            html += '                        <div class="role">Attacker</div>';
            html += '                    </div>';
            html += '                </div>';
            html += '            </td>';
            html += '            <td class="role" colspan="5">';
            html += '                <div class="boxes boxesColor green">';
            html += '                    <div class="boxes-tl"></div>';
            html += '                    <div class="boxes-tr"></div>';
            html += '                    <div class="boxes-tc"></div>';
            html += '                    <div class="boxes-ml"></div>';
            html += '                    <div class="boxes-mr"></div>';
            html += '                    <div class="boxes-mc"></div>';
            html += '                    <div class="boxes-bl"></div>';
            html += '                    <div class="boxes-br"></div>';
            html += '                    <div class="boxes-bc"></div>';
            html += '                    <div class="boxes-contents cf">';
            html += '                        <div class="role">Defender</div>';
            html += '                    </div>';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </thead>';
            html += '    <tbody class="units">';
            html += '        <tr>';
            html += '            <th colspan="1">Losses</th>';
            html += '            <td colspan="5" class="">';
            html += '                <div class="res" style="text-align:center;">';
            html += '                    <img class="r1" src="img/x.gif" alt="Wood"> ' + NumberWithCommas(totalTroopLoss[0]);
            html += '                    <div class="clear"></div>';
            html += '                    <img class="r2" src="img/x.gif" alt="Clay"> ' + NumberWithCommas(totalTroopLoss[1]);
            html += '                    <div class="clear"></div>';
            html += '                    <img class="r3" src="img/x.gif" alt="Iron"> ' + NumberWithCommas(totalTroopLoss[2]);
            html += '                    <div class="clear"></div>';
            html += '                    <img class="r4" src="img/x.gif" alt="Wheat"> ' + NumberWithCommas(totalTroopLoss[3]);
            html += '                    <br><br>';
            html += '                    <img class="" src="img/x.gif" alt="Wood"> ' + NumberWithCommas(totalLoss);
            html += '                </div>';
            html += '            </td>';
            html += '            <td colspan="5" class="last">';
            html += '                <div class="res" style="text-align:center;">';
            html += '                    <img class="r1" src="img/x.gif" alt="Wood"> ' + NumberWithCommas(totalTroopLoss[0]);
            html += '                    <div class="clear"></div>';
            html += '                    <img class="r2" src="img/x.gif" alt="Clay"> ' + NumberWithCommas(totalTroopLoss[1]);
            html += '                    <div class="clear"></div>';
            html += '                    <img class="r3" src="img/x.gif" alt="Iron"> ' + NumberWithCommas(totalTroopLoss[2]);
            html += '                    <div class="clear"></div>';
            html += '                    <img class="r4" src="img/x.gif" alt="Wheat"> ' + NumberWithCommas(totalTroopLoss[3]);
            html += '                    <br><br>';
            html += '                    <img class="" src="img/x.gif" alt="Wood"> ' + NumberWithCommas(totalLoss);
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </tbody>';
            html += '    <tbody class="units last">';
            html += '        <tr>';
            html += '            <th colspan="1">Upkeep</th>';
            html += '            <td colspan="5" class=""><img class="r5" src="img/x.gif" alt="Wood"> 1,260 - <img class="r5" src="img/x.gif" alt="Wood"> 1,260 = <img class="r5" src="img/x.gif" alt="Wood"> 1,260</td>';
            html += '            <td colspan="5" class="last"><img class="r5" src="img/x.gif" alt="Wood"> 1,260 - <img class="r5" src="img/x.gif" alt="Wood"> 1,260 = <img class="r5" src="img/x.gif" alt="Wood"> 1,260</td>';
            html += '        </tr>';
            html += '    </tbody>';
            html += '    <tbody>';
            html += '        <tr>';
            html += '            <td class="empty" colspan="12"></td>';
            html += '        </tr>';
            html += '    </tbody>';
            html += '</table>';

            $('#attacker').append(html);
        });

    };

    var FillVillagesList = function(container) {


        Log("Village list selector successfully added!", "ReportEnhancement");
    };
}

// Metadata for this plugin (Development)
var DevelopmentMetadata = {
    Name: "ReportEnhancement",
    Alias: "Report Enhancement",
    Category: "Utility",
    Version: "0.0.0.1",
    Description: "Show resource loss on report pages",
    Author: "Geczy",
    Site: "https://github.com/JustBuild/Project-Axeman/wiki",

    Settings: {
        RunOnPages: [Enums.TravianPages.Reports],
        PageMustContain: ["#attacker"],
        IsLoginRequired: true
    },

    Flags: {
        Beta: true
    },

    Class: ReportEnhancement
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, DevelopmentMetadata);